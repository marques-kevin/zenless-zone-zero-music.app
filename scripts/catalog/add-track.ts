import { readFile } from "fs/promises";
import { CatalogJson } from "../../src/types/catalog.type";
import { Track } from "../../src/types/track.type";
import {
  buildCatalog,
  deserializeTrack,
  rebuildCatalogPlaylists,
  serializeTrack,
} from "./build-catalog";
import {
  CATALOG_LOCAL_PATH,
  downloadCatalogFromR2,
  uploadCatalogToR2,
  writeLocalCatalog,
} from "./r2";

type ParsedArgs = {
  track_file?: string;
  remote?: boolean;
};

function printUsage() {
  console.log(
    [
      "Add one or more tracks to the remote music catalog",
      "",
      "Usage:",
      "  yarn catalog:add-track --track-file <path-to-track.json>",
      "  yarn catalog:add-track --track-file <path> --remote",
      "",
      "Track file format:",
      "  A single track object or an array of track objects.",
      "  created_at can be an ISO string.",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--track-file") {
      parsed.track_file = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--remote") {
      parsed.remote = true;
    }
  }

  return parsed;
}

function normalizeIncomingTracks(raw: unknown): Track[] {
  const entries = Array.isArray(raw) ? raw : [raw];

  return entries.map((entry) => {
    const track = entry as Track & { created_at: string | Date };

    return {
      ...track,
      created_at:
        track.created_at instanceof Date
          ? track.created_at
          : new Date(track.created_at),
    };
  });
}

function mergeTracks(existing: Track[], incoming: Track[]): Track[] {
  const merged = [...existing];

  for (const track of incoming) {
    const duplicate = merged.find(
      (item) =>
        item.title_id === track.title_id &&
        item.playlist_id === track.playlist_id
    );

    if (duplicate) {
      throw new Error(
        `Track already exists for title_id="${track.title_id}" in playlist "${track.playlist_id}"`
      );
    }

    merged.push(track);
  }

  return merged;
}

async function loadCatalog(remote: boolean): Promise<CatalogJson> {
  if (remote) {
    const remoteContent = await downloadCatalogFromR2();

    if (!remoteContent) {
      return buildCatalog({ version: 1 });
    }

    return JSON.parse(remoteContent) as CatalogJson;
  }

  try {
    const localContent = await readFile(CATALOG_LOCAL_PATH, "utf8");
    return JSON.parse(localContent) as CatalogJson;
  } catch {
    return buildCatalog({ version: 1 });
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const parsed = parseArgs(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  if (!parsed.track_file) {
    console.error("Missing required option: --track-file\n");
    printUsage();
    process.exit(1);
  }

  try {
    const incomingRaw = JSON.parse(
      await readFile(parsed.track_file, "utf8")
    ) as unknown;
    const incomingTracks = normalizeIncomingTracks(incomingRaw);
    const currentCatalog = await loadCatalog(Boolean(parsed.remote));
    const currentTracks = currentCatalog.tracks.map(deserializeTrack);
    const mergedTracks = mergeTracks(currentTracks, incomingTracks);

    const nextCatalog = rebuildCatalogPlaylists({
      ...currentCatalog,
      version: currentCatalog.version + 1,
      updated_at: new Date().toISOString(),
      tracks: mergedTracks.map(serializeTrack),
    });

    const content = JSON.stringify(nextCatalog, null, 2);
    await writeLocalCatalog(content);

    if (parsed.remote) {
      await uploadCatalogToR2(content);
      console.log("Catalog updated locally and on R2");
    } else {
      console.log("Catalog updated locally");
      console.log("Run `yarn catalog:sync` to upload it to R2");
    }

    console.log(`Added ${incomingTracks.length} track(s)`);
    console.log(`Total tracks: ${nextCatalog.tracks.length}`);
    console.log(`Catalog version: ${nextCatalog.version}`);
  } catch (error) {
    console.error("Error adding track to catalog:", error);
    process.exit(1);
  }
}

main();
