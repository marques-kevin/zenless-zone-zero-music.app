import { access, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { characters as existing_characters } from "../../src/database/characters";
import { ZENLESS_TO_CHARACTER_NAME } from "./character-zenless-map";

const ZENLESS_LEVELING_URL = "https://zenless.tools/leveling-calculator";
const ZENLESS_IMAGE_BASE = "https://zenless.tools/images/characters";
const STAGING_DIR = join(process.cwd(), "scripts", "sync-characters", "images");
const PENDING_MANIFEST_PATH = join(
  process.cwd(),
  "scripts",
  "sync-characters",
  "pending-characters.json"
);

type Pending_new_character = {
  type: "new";
  basename: string;
  suggested_name: string | null;
  mapped: boolean;
  image_path: string;
};

type Pending_image_update = {
  type: "image_update";
  basename: string;
  character_name: string;
  current_image: string;
  image_path: string;
};

type Pending_entry = Pending_new_character | Pending_image_update;

const args = new Set(process.argv.slice(2));
const is_dry_run = args.has("--dry-run");
const should_update_staged = args.has("--update");

async function file_exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function fetch_zenless_character_basenames(): Promise<string[]> {
  const response = await fetch(ZENLESS_LEVELING_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${ZENLESS_LEVELING_URL}: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();
  const matches = html.matchAll(/\/images\/characters\/([a-z0-9_]+)\.webp/gi);
  const basenames = new Set<string>();

  for (const match of matches) {
    basenames.add(match[1].toLowerCase());
  }

  if (basenames.size === 0) {
    throw new Error("No character images found on zenless.tools page");
  }

  return [...basenames].sort();
}

function pick_preferred_basename(basenames: string[]): string {
  const v2 = basenames.find((name) => name.endsWith("_v2"));
  if (v2) return v2;

  return basenames.sort((a, b) => b.length - a.length)[0];
}

function group_zenless_basenames_by_character(
  zenless_basenames: string[]
): Map<string, string> {
  const grouped = new Map<string, string[]>();

  for (const basename of zenless_basenames) {
    const character_name = ZENLESS_TO_CHARACTER_NAME[basename];
    if (!character_name) continue;

    const variants = grouped.get(character_name) ?? [];
    variants.push(basename);
    grouped.set(character_name, variants);
  }

  const preferred = new Map<string, string>();
  for (const [character_name, variants] of grouped) {
    preferred.set(character_name, pick_preferred_basename(variants));
  }

  return preferred;
}

function image_basename_from_path(image_path: string): string {
  const filename = image_path.split("/").pop() ?? "";
  return filename.replace(/\.(webp|png|jpg|jpeg)$/i, "");
}

function staging_file_path(basename: string): string {
  return join(STAGING_DIR, `${basename}.webp`);
}

function staging_relative_path(basename: string): string {
  return `scripts/sync-characters/images/${basename}.webp`;
}

async function download_image(basename: string): Promise<void> {
  const url = `${ZENLESS_IMAGE_BASE}/${basename}.webp`;
  const output_path = staging_file_path(basename);

  if (is_dry_run) {
    console.log(`[dry-run] Would download ${url} → ${output_path}`);
    return;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(STAGING_DIR, { recursive: true });
  await writeFile(output_path, buffer);
  console.log(`Staged ${basename}.webp`);
}

function find_new_characters(
  zenless_basenames: string[],
  existing_names: Set<string>
): Pending_new_character[] {
  const preferred_by_character =
    group_zenless_basenames_by_character(zenless_basenames);
  const pending: Pending_new_character[] = [];
  const handled_basenames = new Set<string>();

  for (const [character_name, basename] of preferred_by_character) {
    if (existing_names.has(character_name)) continue;

    pending.push({
      type: "new",
      basename,
      suggested_name: character_name,
      mapped: true,
      image_path: staging_relative_path(basename),
    });
    handled_basenames.add(basename);
  }

  for (const basename of zenless_basenames) {
    if (handled_basenames.has(basename)) continue;
    if (ZENLESS_TO_CHARACTER_NAME[basename]) continue;

    pending.push({
      type: "new",
      basename,
      suggested_name: null,
      mapped: false,
      image_path: staging_relative_path(basename),
    });
    handled_basenames.add(basename);
  }

  return pending.sort((a, b) => a.basename.localeCompare(b.basename));
}

function normalize_basename(basename: string): string {
  return basename.toLowerCase().replace(/[-_]/g, "").replace(/v\d+$/, "");
}

function is_alias_image_change(
  current_basename: string,
  zenless_basename: string
): boolean {
  if (current_basename === zenless_basename) return false;

  const current = normalize_basename(current_basename);
  const zenless = normalize_basename(zenless_basename);

  if (current === zenless) return false;

  const current_in_zenless = zenless.includes(current);
  const zenless_in_current = current.includes(zenless);

  // e.g. anby → anby_demara, lucia → lucia_v2: same asset lineage, skip
  return !current_in_zenless && !zenless_in_current;
}

function find_image_updates(
  zenless_basenames: string[],
  characters_by_name: Map<string, { name: string; image: string }>
): Pending_image_update[] {
  const preferred_by_character =
    group_zenless_basenames_by_character(zenless_basenames);
  const pending: Pending_image_update[] = [];

  for (const [character_name, basename] of preferred_by_character) {
    const existing = characters_by_name.get(character_name);
    if (!existing) continue;

    const current_basename = image_basename_from_path(existing.image);
    if (!is_alias_image_change(current_basename, basename)) continue;

    pending.push({
      type: "image_update",
      basename,
      character_name,
      current_image: existing.image,
      image_path: staging_relative_path(basename),
    });
  }

  return pending.sort((a, b) => a.basename.localeCompare(b.basename));
}

async function write_pending_manifest(pending: {
  new_characters: Pending_new_character[];
  image_updates: Pending_image_update[];
}): Promise<void> {
  const manifest = {
    generated_at: new Date().toISOString(),
    source: ZENLESS_LEVELING_URL,
    ...pending,
  };

  if (is_dry_run) {
    console.log("[dry-run] Would write pending-characters.json");
    return;
  }

  await writeFile(PENDING_MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log("Wrote pending-characters.json");
}

async function stage_entries(entries: Pending_entry[]): Promise<{
  downloaded: number;
  skipped: number;
}> {
  let downloaded = 0;
  let skipped = 0;

  for (const entry of entries) {
    const local_path = staging_file_path(entry.basename);
    const local_exists = await file_exists(local_path);

    if (local_exists && !should_update_staged) {
      console.log(`Skipped ${entry.basename}.webp (already staged)`);
      skipped++;
      continue;
    }

    await download_image(entry.basename);
    if (!is_dry_run) downloaded++;
  }

  return { downloaded, skipped };
}

async function main() {
  console.log(`Fetching characters from ${ZENLESS_LEVELING_URL}...`);
  const zenless_basenames = await fetch_zenless_character_basenames();
  console.log(`Found ${zenless_basenames.length} characters on zenless.tools`);

  const characters_by_name = new Map(
    existing_characters.map((character) => [character.name, character])
  );
  const existing_names = new Set(characters_by_name.keys());

  const new_characters = find_new_characters(zenless_basenames, existing_names);
  const image_updates = find_image_updates(
    zenless_basenames,
    characters_by_name
  );
  const pending = [...new_characters, ...image_updates];

  if (pending.length === 0) {
    console.log("No new characters or image updates to stage.");
    return;
  }

  if (new_characters.length > 0) {
    console.log(`\n${new_characters.length} new character(s):\n`);
    for (const character of new_characters) {
      const label = character.suggested_name ?? "(unmapped)";
      console.log(`  - ${character.basename} → ${label}`);
    }
  }

  if (image_updates.length > 0) {
    console.log(`\n${image_updates.length} image update(s):\n`);
    for (const update of image_updates) {
      console.log(
        `  - ${update.basename} → ${update.character_name} (current: ${update.current_image})`
      );
    }
  }

  const { downloaded, skipped } = await stage_entries(pending);

  await write_pending_manifest({ new_characters, image_updates });

  console.log("\nSummary:");
  console.log(`  Staged: ${downloaded}`);
  console.log(`  Skipped (already staged): ${skipped}`);
  console.log(`  New characters: ${new_characters.length}`);
  console.log(`  Image updates: ${image_updates.length}`);
  console.log(
    "\nNext step: review scripts/sync-characters/images/ and pending-characters.json."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
