import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Track } from "../../../src/types/track.type";

function getAlbumFilePath(version: string): string {
  return join(process.cwd(), "src", "database", "albums", `${version}.ts`);
}

function formatCreatedAt(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function escapeTitle(title: string): string {
  return title.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatTrackEntry(
  track: Track,
  version: string,
  usesMapPattern: boolean
): string {
  const lines = [
    "  {",
    `    title: "${escapeTitle(track.title)}",`,
    `    title_id: "${track.title_id}",`,
    `    source: "${track.source}",`,
    `    duration: ${track.duration},`,
    `    created_at: new Date("${formatCreatedAt(track.created_at)}"),`,
    `    ...Artists["${version}"],`,
  ];

  if (!usesMapPattern) {
    lines.push(`    ...Albums["${version}"],`);
  }

  lines.push("  },");

  return lines.join("\n");
}

export async function localTrackExists(
  title_id: string,
  version: string
): Promise<boolean> {
  const albumPath = getAlbumFilePath(version);
  const content = await readFile(albumPath, "utf8");
  return content.includes(`title_id: "${title_id}"`);
}

export async function addTrackToLocalDatabase(
  track: Track,
  version: string
): Promise<void> {
  const albumPath = getAlbumFilePath(version);
  let content = await readFile(albumPath, "utf8");

  if (content.includes(`title_id: "${track.title_id}"`)) {
    throw new Error(
      `Track already exists in local database: ${track.title_id} (${version})`
    );
  }

  const usesMapPattern = content.includes("].map((track) => ({");
  const entry = formatTrackEntry(track, version, usesMapPattern);
  const mapPattern = /\n]\.map\(\(track\) => \(\{/;
  const arrayEndPattern = /\n];/;

  if (mapPattern.test(content)) {
    content = content.replace(mapPattern, `\n${entry}\n].map((track) => ({`);
  } else if (arrayEndPattern.test(content)) {
    content = content.replace(arrayEndPattern, `\n${entry}\n];`);
  } else {
    throw new Error(`Unsupported album file format: ${albumPath}`);
  }

  await writeFile(albumPath, content, "utf8");
}
