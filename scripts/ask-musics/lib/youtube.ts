import { mkdir, readdir, rename, unlink } from "fs/promises";
import { dirname, join } from "path";
import {
  requireCmd,
  runCommand,
  runCommandCapture,
  ytdlpBin,
} from "../../youtube-downloader/ytdlp";

const DOWNLOAD_DIR = join(process.cwd(), "scripts/youtube-downloader/files");

function extractYtdlpError(stderr: string, fallback: string): string {
  const errorLine = stderr
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("ERROR:"))
    .pop();

  return errorLine?.replace(/^ERROR:\s*/, "") || fallback;
}

type YtdlpVideoJson = {
  id?: string;
  title?: string;
  description?: string;
  channel?: string;
  uploader?: string;
  duration?: number;
};

export type YoutubeMetadata = {
  title: string;
  description: string;
  channel: string;
  duration: number;
  video_id: string;
};

export async function fetchYoutubeMetadata(
  url: string
): Promise<YoutubeMetadata> {
  await requireCmd(ytdlpBin);

  const { code, stdout, stderr } = await runCommandCapture(ytdlpBin, [
    "--no-playlist",
    "--dump-single-json",
    url,
  ]);

  if (code !== 0) {
    throw new Error(
      extractYtdlpError(stderr, `Failed to fetch metadata for ${url}`)
    );
  }

  const data = JSON.parse(stdout) as YtdlpVideoJson;

  if (!data.id || !data.title) {
    throw new Error(`Incomplete metadata for ${url}`);
  }

  return {
    video_id: data.id,
    title: data.title,
    description: data.description ?? "",
    channel: data.channel ?? data.uploader ?? "",
    duration: Math.round(Number(data.duration) || 0),
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
    "-f",
    "bestaudio/best",
    "-x",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--add-metadata",
    "--extractor-args",
    "youtube:player_client=web,mweb,tv",
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
      `Expected one downloaded mp3 file, found ${
        created.length
      }: ${created.join(", ")}`
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
