import { unlink } from "fs/promises";
import { join } from "path";
import { serializeTrack } from "../catalog/build-catalog";
import { getTrackKey } from "../catalog/catalog-utils";
import { mutateRemoteCatalog, loadRemoteCatalog } from "../catalog/catalog-store";
import { uploadMusicFileToR2 } from "../catalog/r2";
import { Track } from "../../src/types/track.type";
import { fetchPendingRequests } from "./lib/pending";
import {
  buildMusicFilename,
  buildTitleId,
  buildTrackEntry,
  ensureMusicDoesNotExist,
  getAudioDurationSeconds,
  inferVersionFromTitle,
} from "./lib/track-builder";
import { updateRequestStatus } from "./lib/update-status";
import {
  downloadYoutubeMp3,
  fetchYoutubeMetadata,
  moveDownloadedFile,
} from "./lib/youtube";
import {
  notifyAskMusicError,
  notifyAskMusicFinished,
  notifyAskMusicRequestFailed,
  notifyAskMusicStarted,
} from "./lib/discord";
import { ProcessResult } from "./lib/process-result";
import { AskMusicRequest } from "./types";

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
      "Process pending ask-music requests end-to-end",
      "",
      "Usage:",
      "  yarn ask-musics:process-pending [--dry-run] [--limit <n>] [--version <x.y>]",
      "  yarn ask-musics:process-pending --url <youtube-url> [--dry-run] [--version <x.y>]",
      "",
      "Pipeline per request:",
      "  1. Fetch YouTube metadata",
      "  2. Download MP3",
      "  3. Move to musics/ with version prefix",
      "  4. Upload MP3 to R2",
      "  5. Add track to remote catalog",
      "  6. Mark request as added",
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

async function catalogHasTrack(
  title_id: string,
  version: string
): Promise<boolean> {
  const catalog = await loadRemoteCatalog();
  return catalog.tracks.some(
    (track) => track.title_id === title_id && track.playlist_id === version
  );
}

async function addTrackToCatalog(track: Track): Promise<void> {
  await mutateRemoteCatalog((catalog) => {
    const key = getTrackKey(track);

    if (
      catalog.tracks.some((entry) => {
        const existingTitleId = entry.title_id;
        const existingPlaylistId = entry.playlist_id;
        return `${existingTitleId}::${existingPlaylistId}` === key;
      })
    ) {
      throw new Error(`Track already exists in catalog: ${key}`);
    }

    return {
      ...catalog,
      tracks: [...catalog.tracks, serializeTrack(track)],
    };
  });
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

    if (await catalogHasTrack(title_id, version)) {
      if (!is_dry_run) {
        await updateRequestStatus({ url, status: "added" });
      }

      return {
        url,
        status: "skipped",
        message: `Track already in catalog (${title_id}), request marked as added`,
        title_id,
      };
    }

    if (is_dry_run) {
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

    await uploadMusicFileToR2(destination_path);
    await addTrackToCatalog(track);
    await updateRequestStatus({ url, status: "added" });
    await unlink(destination_path).catch(() => undefined);

    return {
      url,
      status: "added",
      message: `Added ${filename} (${duration}s) to catalog v${version}`,
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
      console.log("No pending music requests to process.");
      return;
    }

    await notifyAskMusicStarted({ requests, is_dry_run });

    console.log(`Processing ${requests.length} request(s)...`);

    const results: ProcessResult[] = [];

    for (const request of requests) {
      console.log(`\n→ ${request.url}`);
      const result = await processRequest(request, parsed.version);
      results.push(result);
      console.log(`  ${result.status}: ${result.message}`);

      if (result.status === "failed") {
        await notifyAskMusicRequestFailed({
          url: result.url,
          message: result.message,
        });
      }
    }

    const added = results.filter((result) => result.status === "added").length;
    const skipped = results.filter((result) => result.status === "skipped").length;
    const failed = results.filter((result) => result.status === "failed").length;

    console.log("\nSummary");
    console.log(`  added: ${added}`);
    console.log(`  skipped: ${skipped}`);
    console.log(`  failed: ${failed}`);

    await notifyAskMusicFinished({ results, is_dry_run });

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error processing pending requests";

    console.error("Error processing pending requests:", error);
    await notifyAskMusicError(message);
    process.exit(1);
  }
}

main();
