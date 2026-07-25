import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import {
  buildCatalogFromTypescript,
  getCatalogStats,
  mergeCatalogs,
  parseCatalogJson,
} from "./catalog-utils";
import { downloadCatalogFromR2 } from "./r2";

const OUTPUT_PATH = join(process.cwd(), "catalog/tracks.json");
const args = new Set(process.argv.slice(2));
const merge_remote = args.has("--merge-remote");

function printUsage() {
  console.log(
    [
      "Export the local TypeScript catalog to catalog/tracks.json",
      "",
      "Usage:",
      "  yarn catalog:export [--merge-remote]",
      "",
      "Options:",
      "  --merge-remote  Merge with the remote R2 catalog instead of overwriting",
      "",
      "Warning:",
      "  Without --merge-remote, tracks added only on R2 will be lost locally.",
      "  Never run `catalog:export && catalog:sync` after automation additions.",
    ].join("\n")
  );
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    const typescriptCatalog = buildCatalogFromTypescript();
    let catalog = typescriptCatalog;

    if (merge_remote) {
      const remoteContent = await downloadCatalogFromR2();
      const remoteCatalog = remoteContent ? parseCatalogJson(remoteContent) : null;
      catalog = mergeCatalogs({
        remote: remoteCatalog,
        incoming: typescriptCatalog,
      });
      console.log("Merged TypeScript export with remote catalog");
    } else {
      console.warn(
        "Exporting from TypeScript only. Remote-only tracks will not be included."
      );
      console.warn("Use --merge-remote to preserve tracks added via automation.");
    }

    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify(catalog, null, 2), "utf8");

    const stats = getCatalogStats(catalog);
    console.log(`Catalog exported to ${OUTPUT_PATH}`);
    console.log(`Version: ${stats.version}`);
    console.log(`Tracks: ${stats.track_count}`);
    console.log(`Playlists: ${stats.playlist_count}`);
  } catch (error) {
    console.error("Error exporting catalog:", error);
    process.exit(1);
  }
}

main();
