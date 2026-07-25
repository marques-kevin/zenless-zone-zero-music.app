import { readFile } from "fs/promises";
import { Track } from "../../src/types/track.type";
import {
  deserializeTrack,
  serializeTrack,
} from "./build-catalog";
import { getTrackKey } from "./catalog-utils";
import { mutateRemoteCatalog } from "./catalog-store";

type ParsedArgs = {
  title_id?: string;
  playlist_id?: string;
  track_file?: string;
};

function printUsage() {
  console.log(
    [
      "Update an existing track in the remote catalog",
      "",
      "Usage:",
      "  yarn catalog:update-track --title-id <id> --playlist-id <id> --track-file <path>",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--title-id") {
      parsed.title_id = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--playlist-id") {
      parsed.playlist_id = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--track-file") {
      parsed.track_file = argv[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function normalizeTrack(raw: unknown): Track {
  const track = raw as Track & { created_at: string | Date };

  return {
    ...track,
    created_at:
      track.created_at instanceof Date
        ? track.created_at
        : new Date(track.created_at),
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const parsed = parseArgs(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  if (!parsed.title_id || !parsed.playlist_id || !parsed.track_file) {
    console.error("Missing required options: --title-id, --playlist-id, --track-file\n");
    printUsage();
    process.exit(1);
  }

  try {
    const updatedTrack = normalizeTrack(
      JSON.parse(await readFile(parsed.track_file, "utf8"))
    );
    const targetKey = getTrackKey({
      title_id: parsed.title_id,
      playlist_id: parsed.playlist_id,
    });

    const nextCatalog = await mutateRemoteCatalog((catalog) => {
      let found = false;

      const tracks = catalog.tracks.map((entry) => {
        const track = deserializeTrack(entry);

        if (getTrackKey(track) !== targetKey) {
          return entry;
        }

        found = true;

        if (
          updatedTrack.title_id !== parsed.title_id ||
          updatedTrack.playlist_id !== parsed.playlist_id
        ) {
          throw new Error(
            "track-file title_id and playlist_id must match the targeted track"
          );
        }

        return serializeTrack(updatedTrack);
      });

      if (!found) {
        throw new Error(`Track not found: ${targetKey}`);
      }

      return {
        ...catalog,
        tracks,
      };
    });

    console.log(`Updated track ${targetKey}`);
    console.log(`Catalog version: ${nextCatalog.version}`);
  } catch (error) {
    console.error("Error updating track:", error);
    process.exit(1);
  }
}

main();
