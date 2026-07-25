import { spawn } from "child_process";
import { access } from "fs/promises";
import { join } from "path";
import { Albums } from "../../../src/database/albums";
import { Artists } from "../../../src/database/artists";
import { Track } from "../../../src/types/track.type";

const VERSION_PATTERN = /\b(\d+\.\d+)\b/;

export function getVersionAlbumIds(): string[] {
  return Object.keys(Albums)
    .filter((key) => /^\d+\.\d+$/.test(key))
    .sort(compareVersions);
}

export function getLatestVersion(): string {
  const versions = getVersionAlbumIds();
  return versions[versions.length - 1] ?? "3.0";
}

export function compareVersions(a: string, b: string): number {
  const [aMajor, aMinor] = a.split(".").map(Number);
  const [bMajor, bMinor] = b.split(".").map(Number);

  if (aMajor !== bMajor) {
    return aMajor - bMajor;
  }

  return aMinor - bMinor;
}

export function inferVersionFromTitle(title: string, fallback?: string): string {
  const versions = getVersionAlbumIds();
  const matches = [...title.matchAll(new RegExp(VERSION_PATTERN, "g"))]
    .map((match) => match[1])
    .filter((version) => versions.includes(version));

  if (matches.length > 0) {
    return matches.sort(compareVersions)[matches.length - 1];
  }

  return fallback ?? getLatestVersion();
}

export function cleanYoutubeTitle(title: string): string {
  return title
    .replace(/\s*\|\s*zenless zone zero.*$/i, "")
    .replace(/^zenless zone zero\s*[-|:]?\s*/i, "")
    .replace(/\s*\(.*?official.*?\)\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toKebabCase(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildTitleId(title: string): string {
  const cleaned = cleanYoutubeTitle(title);
  const withoutVersion = cleaned.replace(/^(\d+\.\d+)\s*[-:]?\s*/i, "");
  return toKebabCase(withoutVersion);
}

export function buildMusicFilename(params: {
  version: string;
  title_id: string;
}): string {
  return `${params.version}--${params.title_id}.mp3`;
}

export async function getAudioDurationSeconds(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      "ffprobe",
      [
        "-v",
        "quiet",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        filePath,
      ],
      { stdio: ["ignore", "pipe", "pipe"] }
    );

    let stdout = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe failed for ${filePath}`));
        return;
      }

      const duration = Math.round(Number(stdout.trim()));
      if (!duration) {
        reject(new Error(`Invalid duration for ${filePath}`));
        return;
      }

      resolve(duration);
    });
  });
}

export function buildTrackEntry(params: {
  title: string;
  title_id: string;
  version: string;
  source: string;
  duration: number;
  created_at?: string;
}): Track {
  const album = Albums[params.version];
  const artist = Artists[params.version as keyof typeof Artists];

  if (!album || !artist) {
    throw new Error(`Unknown version album: ${params.version}`);
  }

  return {
    title: cleanYoutubeTitle(params.title),
    title_id: params.title_id,
    source: params.source,
    duration: params.duration,
    created_at: new Date(params.created_at ?? new Date().toISOString()),
    artist: artist.artist,
    artist_id: artist.artist_id,
    playlist_cover: album.playlist_cover,
    playlist_id: album.playlist_id,
    playlist_name: album.playlist_name,
    playlist_type: album.playlist_type,
  };
}

export async function ensureMusicDoesNotExist(filename: string): Promise<void> {
  const localPath = join(process.cwd(), "musics", filename);

  try {
    await access(localPath);
    throw new Error(`Music file already exists locally: musics/${filename}`);
  } catch (error: any) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}
