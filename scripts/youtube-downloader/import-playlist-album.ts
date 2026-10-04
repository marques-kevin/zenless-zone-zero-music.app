import { mkdir, writeFile } from "fs/promises";
import path from "path";
import {
  buildMusicFilename,
  buildTitleId,
  buildTrackEntry,
  cleanYoutubeTitle,
  compareVersions,
  inferVersionFromTitle,
} from "../ask-musics/lib/track-builder";
import { requireCmd, runCommandCapture, ytdlpBin, ytdlpPrint } from "./ytdlp";

const CREATED_AT = "2026-09-09";

async function getDurationSeconds(url: string): Promise<number> {
  const { code, stdout, stderr } = await runCommandCapture(ytdlpBin, [
    "--no-download",
    "--print",
    "%(duration)s",
    url,
  ]);

  if (code !== 0) {
    throw new Error(stderr.trim() || `Failed to read duration for ${url}`);
  }

  const duration = Math.round(Number(stdout.trim()));
  if (!duration) {
    throw new Error(`Invalid duration for ${url}`);
  }

  return duration;
}

function escapeTitle(title: string): string {
  return title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatTrackBlock(
  track: ReturnType<typeof buildTrackEntry>,
  version: string
): string {
  return [
    "  {",
    `    title: "${escapeTitle(track.title)}",`,
    `    title_id: "${track.title_id}",`,
    `    source: "${track.source}",`,
    `    duration: ${track.duration},`,
    `    created_at: new Date("${CREATED_AT}"),`,
    `    ...Artists["${version}"],`,
    `    ...Albums["${version}"],`,
    "  },",
  ].join("\n");
}

async function main() {
  const version = process.argv[2];
  const playlistUrl = process.argv[3];

  if (!version || !playlistUrl) {
    console.error(
      'Usage: tsx scripts/youtube-downloader/import-playlist-album.ts <version> "<playlist-url>" [--metadata-only]'
    );
    process.exit(1);
  }

  const metadataOnly = process.argv.includes("--metadata-only");

  await requireCmd(ytdlpBin);

  const titles = (
    await ytdlpPrint(playlistUrl, "%(title)s")
  )
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const urls = (
    await ytdlpPrint(playlistUrl, "%(url)s")
  )
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (titles.length !== urls.length) {
    throw new Error("Title/URL count mismatch from playlist");
  }

  if (!metadataOnly) {
    await mkdir(path.join(process.cwd(), "musics"), { recursive: true });
  }

  const trackBlocks: string[] = [];

  for (let i = 0; i < titles.length; i += 1) {
    const rawTitle = titles[i];
    const inferred = inferVersionFromTitle(rawTitle, version);

    if (compareVersions(inferred, version) !== 0) {
      console.log(`Skip (version ${inferred}): ${rawTitle}`);
      continue;
    }

    const title_id = buildTitleId(rawTitle);
    const filename = buildMusicFilename({ version, title_id });
    const source = `/musics/${filename}`;

    console.log(`Metadata: ${cleanYoutubeTitle(rawTitle)}`);
    const duration = await getDurationSeconds(urls[i]);

    const track = buildTrackEntry({
      title: rawTitle,
      title_id,
      version,
      source,
      duration,
      created_at: CREATED_AT,
    });

    trackBlocks.push(formatTrackBlock(track, version));
  }

  const albumPath = path.join(
    process.cwd(),
    "src",
    "database",
    "albums",
    `${version}.ts`
  );

  const exportName = `Album${version.replace(".", "")}Tracks`;

  const fileContent = [
    'import { Track } from "@/types/track.type";',
    'import { Albums } from "../albums";',
    'import { Artists } from "../artists";',
    "",
    `export const ${exportName}: Track[] = [`,
    trackBlocks.join("\n"),
    "];",
    "",
  ].join("\n");

  await writeFile(albumPath, fileContent, "utf8");
  console.log(`Wrote ${trackBlocks.length} track(s) to ${albumPath}`);

  if (metadataOnly) {
    console.log(
      "\nMP3 files were not downloaded. Run:\n  yarn playlist \"<url>\"\n  yarn mp3\nThen rename files in musics/ to match source paths, and yarn sync-music."
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
