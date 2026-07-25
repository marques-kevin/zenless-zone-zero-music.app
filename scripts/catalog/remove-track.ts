import { deserializeTrack } from "./build-catalog";
import { getTrackKey } from "./catalog-utils";
import { mutateRemoteCatalog } from "./catalog-store";

type ParsedArgs = {
  title_id?: string;
  playlist_id?: string;
};

function printUsage() {
  console.log(
    [
      "Remove a track from the remote catalog",
      "",
      "Usage:",
      "  yarn catalog:remove-track --title-id <id> --playlist-id <id>",
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

  if (!parsed.title_id || !parsed.playlist_id) {
    console.error("Missing required options: --title-id, --playlist-id\n");
    printUsage();
    process.exit(1);
  }

  const targetKey = getTrackKey({
    title_id: parsed.title_id,
    playlist_id: parsed.playlist_id,
  });

  try {
    const nextCatalog = await mutateRemoteCatalog((catalog) => {
      const remaining = catalog.tracks.filter((entry) => {
        const track = deserializeTrack(entry);
        return getTrackKey(track) !== targetKey;
      });

      if (remaining.length === catalog.tracks.length) {
        throw new Error(`Track not found: ${targetKey}`);
      }

      return {
        ...catalog,
        tracks: remaining,
      };
    });

    console.log(`Removed track ${targetKey}`);
    console.log(`Total tracks: ${nextCatalog.tracks.length}`);
    console.log(`Catalog version: ${nextCatalog.version}`);
  } catch (error) {
    console.error("Error removing track:", error);
    process.exit(1);
  }
}

main();
