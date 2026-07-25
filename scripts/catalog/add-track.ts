import { readFile } from "fs/promises";
import { Track } from "../../src/types/track.type";
import {
  deserializeTrack,
  serializeTrack,
} from "./build-catalog";
import { getTrackKey, mergeTrackLists } from "./catalog-utils";
import { mutateRemoteCatalog } from "./catalog-store";

type ParsedArgs = {
  track_file?: string;
};

function printUsage() {
  console.log(
    [
      "Add one or more tracks to the remote catalog",
      "",
      "Usage:",
      "  yarn catalog:add-track --track-file <path-to-track.json>",
      "",
      "Track file format:",
      "  A single track object or an array of track objects.",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--track-file") {
      parsed.track_file = argv[index + 1];
      index += 1;
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

    const nextCatalog = await mutateRemoteCatalog((catalog) => {
      const currentTracks = catalog.tracks.map(deserializeTrack);

      for (const track of incomingTracks) {
        if (currentTracks.some((item) => getTrackKey(item) === getTrackKey(track))) {
          throw new Error(
            `Track already exists for title_id="${track.title_id}" in playlist "${track.playlist_id}"`
          );
        }
      }

      return {
        ...catalog,
        tracks: mergeTrackLists(currentTracks, incomingTracks).map(serializeTrack),
      };
    });

    console.log(`Added ${incomingTracks.length} track(s)`);
    console.log(`Total tracks: ${nextCatalog.tracks.length}`);
    console.log(`Catalog version: ${nextCatalog.version}`);
  } catch (error) {
    console.error("Error adding track:", error);
    process.exit(1);
  }
}

main();
