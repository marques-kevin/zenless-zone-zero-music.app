import {
  deserializeTrack,
  serializeTrack,
} from "./build-catalog";
import { mutateRemoteCatalog } from "./catalog-store";

type ParsedArgs = {
  playlist_id?: string;
  name?: string;
  cover?: string;
  type?: "jukebox" | "character" | "most_liked" | "most_played";
};

function printUsage() {
  console.log(
    [
      "Update playlist metadata on all tracks in the remote catalog",
      "",
      "Usage:",
      "  yarn catalog:update-playlist --playlist-id <id> [--name <name>] [--cover <path>] [--type <type>]",
      "",
      "At least one of --name, --cover or --type is required.",
    ].join("\n")
  );
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--playlist-id") {
      parsed.playlist_id = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--name") {
      parsed.name = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--cover") {
      parsed.cover = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--type") {
      parsed.type = argv[index + 1] as ParsedArgs["type"];
      index += 1;
    }
  }

  return parsed;
}

async function main() {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const parsed = parseArgs(argv);

  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  if (!parsed.playlist_id) {
    console.error("Missing required option: --playlist-id\n");
    printUsage();
    process.exit(1);
  }

  if (!parsed.name && !parsed.cover && !parsed.type) {
    console.error("Provide at least one of --name, --cover or --type\n");
    printUsage();
    process.exit(1);
  }

  try {
    const nextCatalog = await mutateRemoteCatalog((catalog) => {
      let updatedCount = 0;

      const tracks = catalog.tracks.map((entry) => {
        const track = deserializeTrack(entry);

        if (track.playlist_id !== parsed.playlist_id) {
          return entry;
        }

        updatedCount += 1;

        return serializeTrack({
          ...track,
          playlist_name: parsed.name ?? track.playlist_name,
          playlist_cover: parsed.cover ?? track.playlist_cover,
          playlist_type: parsed.type ?? track.playlist_type,
        });
      });

      if (updatedCount === 0) {
        throw new Error(`Playlist not found: ${parsed.playlist_id}`);
      }

      return {
        ...catalog,
        tracks,
      };
    });

    console.log(`Updated playlist ${parsed.playlist_id}`);
    console.log(`Catalog version: ${nextCatalog.version}`);
  } catch (error) {
    console.error("Error updating playlist:", error);
    process.exit(1);
  }
}

main();
