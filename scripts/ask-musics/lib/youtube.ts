import { mkdir, readdir, rename, unlink } from "fs/promises";
import { dirname, join } from "path";
import { requireCmd, runCommand, runCommandCapture, ytdlpBin } from "../../youtube-downloader/ytdlp";

const DOWNLOAD_DIR = join(
  process.cwd(),
  "scripts/youtube-downloader/files"
);

export type YoutubeMetadata = {
  title: string;
  duration: number;
  video_id: string;
};

export async function fetchYoutubeMetadata(url: string): Promise<YoutubeMetadata> {
  await requireCmd(ytdlpBin);

  const { code, stdout, stderr } = await runCommandCapture(ytdlpBin, [
    "--no-playlist",
    "--print",
    "%(id)s",
    "--print",
    "%(title)s",
    "--print",
    "%(duration)s",
    url,
  ]);

  if (code !== 0) {
    throw new Error(stderr.trim() || `Failed to fetch metadata for ${url}`);
  }

  const [video_id, title, durationRaw] = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!video_id || !title) {
    throw new Error(`Incomplete metadata for ${url}`);
  }

  return {
    video_id,
    title,
    duration: Math.round(Number(durationRaw) || 0),
  };
}

export async function downloadYoutubeMp3(url: string): Promise<string> {
  await requireCmd(ytdlpBin);
  await mkdir(DOWNLOAD_DIR, { recursive: true });

  const before = new Set(await readdir(DOWNLOAD_DIR));

  const code = await runCommand(ytdlpBin, [
    "--no-progress",
    "--no-playlist",
    "--restrict-filenames",
    "-x",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--add-metadata",
    "-o",
    join(DOWNLOAD_DIR, "%(title)s.%(ext)s"),
    url,
  ]);

  if (code !== 0) {
    throw new Error(`Failed to download ${url}`);
  }

  const after = await readdir(DOWNLOAD_DIR);
  const created = after.filter(
    (file) => !before.has(file) && file.endsWith(".mp3")
  );

  if (created.length !== 1) {
    throw new Error(
      `Expected one downloaded mp3 file, found ${created.length}: ${created.join(", ")}`
    );
  }

  return join(DOWNLOAD_DIR, created[0]);
}

export async function moveDownloadedFile(params: {
  source_path: string;
  destination_path: string;
}): Promise<void> {
  await mkdir(dirname(params.destination_path), { recursive: true });

  try {
    await rename(params.source_path, params.destination_path);
  } catch {
    await unlink(params.source_path).catch(() => undefined);
    throw new Error(`Failed to move file to ${params.destination_path}`);
  }
}
