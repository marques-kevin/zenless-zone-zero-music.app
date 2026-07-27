import { join } from "path";
import dotenv from "dotenv";
import { Track } from "../../src/types/track.type";
import { uploadLocalMusicFileToR2 } from "../lib/music-storage";
import { fetchPendingRequests } from "./lib/pending";
import {
  buildMusicFilename,
  buildTitleId,
  buildTrackEntry,
  ensureMusicDoesNotExist,
  getAudioDurationSeconds,
  inferVersionFromTitle,
} from "./lib/track-builder";
import {
  addTrackToLocalDatabase,
  localTrackExists,
} from "./lib/local-track-store";
import { updateRequestStatus } from "./lib/update-status";
import {
  downloadYoutubeMp3,
  fetchYoutubeMetadata,
  moveDownloadedFile,
} from "./lib/youtube";
import {
  resolveAutomationStatus,
  writeAutomationReport,
} from "./lib/automation-report";
import { ProcessResult } from "./lib/process-result";
import { AskMusicRequest } from "./types";

dotenv.config();

type ParsedArgs = {
  url?: string;
  version?: string;
  limit?: number;
};

const args = new Set(process.argv.slice(2));
const is_dry_run = args.has("--dry-run");

function printUsage() {
  console.log(
    [
      "Process pending ask-music requests end-to-end (local database)",
      "",
      "Usage:",
      "  yarn ask-musics:process-pending [--dry-run] [--limit <n>] [--version <x.y>]",
      "  yarn ask-musics:process-pending --url <youtube-url> [--dry-run] [--version <x.y>]",
      "",
      "Pipeline per request:",
      "  1. Fetch YouTube metadata (title, description, channel)",
      "  2. Download MP3",
      "  3. Move to musics/ with version prefix",
      "  4. Append track to src/database/albums/<version>.ts",
      "  5. Upload MP3 to Cloudflare R2",
      "  6. Mark request as added",
      "",
      "After processing, commit src/database/albums/ changes only (musics/ is gitignored).",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--url") {
      parsed.url = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--version") {
      parsed.version = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--limit") {
      parsed.limit = Number(argv[index + 1]);
      index += 1;
    }
  }

  return parsed;
}

async function processRequest(
  request: AskMusicRequest,
  defaultVersion?: string
): Promise<ProcessResult> {
  const url = request.url;

  try {
    const metadata = await fetchYoutubeMetadata(url);
    const version = inferVersionFromTitle(metadata.title, defaultVersion);
    const title_id = buildTitleId(metadata.title);
    const filename = buildMusicFilename({ version, title_id });
    const source = `/musics/${filename}`;
    const destination_path = join(process.cwd(), "musics", filename);

    if (await localTrackExists(title_id, version)) {
      if (!is_dry_run) {
        await updateRequestStatus({ url, status: "added" });
      }

      return {
        url,
        status: "skipped",
        message: `Track already in local database (${title_id}), request marked as added`,
        title_id,
      };
    }

    if (is_dry_run) {
      console.log(`  title: ${metadata.title}`);
      console.log(`  channel: ${metadata.channel}`);
      console.log(`  description: ${metadata.description || "(empty)"}`);

      return {
        url,
        status: "added",
        message: `[dry-run] Would add ${filename} to version ${version}`,
        title_id,
      };
    }

    await ensureMusicDoesNotExist(filename);

    const downloaded_path = await downloadYoutubeMp3(url);
    await moveDownloadedFile({
      source_path: downloaded_path,
      destination_path,
    });

    const duration = await getAudioDurationSeconds(destination_path);
    const track = buildTrackEntry({
      title: metadata.title,
      title_id,
      version,
      source,
      duration,
    });

    await addTrackToLocalDatabase(track, version);
    const uploaded_key = await uploadLocalMusicFileToR2(destination_path);
    await updateRequestStatus({ url, status: "added" });

    return {
      url,
      status: "added",
      message: `Added ${filename} (${duration}s) to src/database/albums/${version}.ts and uploaded to ${uploaded_key}`,
      title_id,
    };
  } catch (error: any) {
    return {
      url,
      status: "failed",
      message: error?.message || "Unknown error",
    };
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const parsed = parseArgs(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    let requests: AskMusicRequest[];

    if (parsed.url) {
      requests = [
        {
          id: parsed.url,
          url: parsed.url,
          users: [],
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    } else {
      requests = await fetchPendingRequests();
    }

    if (parsed.limit && parsed.limit > 0) {
      requests = requests.slice(0, parsed.limit);
    }

    if (requests.length === 0) {
      const report_path = await writeAutomationReport({
        ran_at: new Date().toISOString(),
        is_dry_run,
        status: "empty",
        requests: [],
        results: [],
      });

      console.log("No pending music requests to process.");
      console.log(`Report written to ${report_path}`);
      return;
    }

    console.log(`Processing ${requests.length} request(s)...`);

    const results: ProcessResult[] = [];

    for (const request of requests) {
      console.log(`\n→ ${request.url}`);
      const result = await processRequest(request, parsed.version);
      results.push(result);
      console.log(`  ${result.status}: ${result.message}`);
    }

    const report_path = await writeAutomationReport({
      ran_at: new Date().toISOString(),
      is_dry_run,
      status: resolveAutomationStatus(results),
      requests,
      results,
    });

    const added = results.filter((result) => result.status === "added").length;
    const skipped = results.filter(
      (result) => result.status === "skipped"
    ).length;
    const failed = results.filter(
      (result) => result.status === "failed"
    ).length;

    console.log("\nSummary");
    console.log(`  added: ${added}`);
    console.log(`  skipped: ${skipped}`);
    console.log(`  failed: ${failed}`);
    console.log(`Report written to ${report_path}`);

    if (added > 0) {
      console.log(
        "\nNext step: commit src/database/albums/ changes and open a PR."
      );
    }

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error processing pending requests";

    console.error("Error processing pending requests:", error);

    const report_path = await writeAutomationReport({
      ran_at: new Date().toISOString(),
      is_dry_run,
      status: "error",
      requests: [],
      results: [],
      error: message,
    });

    console.log(`Report written to ${report_path}`);
    process.exit(1);
  }
}

main();
