import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import {
  buildCatalogFromTypescript,
  getCatalogStats,
} from "./catalog-utils";

const OUTPUT_PATH = join(process.cwd(), "catalog/tracks.json");

function printUsage() {
  console.log(
    [
      "Export the local TypeScript catalog to catalog/tracks.json (local file only)",
      "",
      "Usage:",
      "  yarn catalog:export",
      "",
      "This command never uploads to R2.",
      "Use CRUD commands to modify the remote catalog.",
    ].join("\n")
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }

  try {
    const catalog = buildCatalogFromTypescript();
    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify(catalog, null, 2), "utf8");

    const stats = getCatalogStats(catalog);
    console.log(`Local catalog exported to ${OUTPUT_PATH}`);
    console.log(`Version: ${stats.version}`);
    console.log(`Tracks: ${stats.track_count}`);
    console.log(`Playlists: ${stats.playlist_count}`);
    console.log("This file is for local reference only and was not uploaded to R2.");
  } catch (error) {
    console.error("Error exporting catalog:", error);
    process.exit(1);
  }
}

main();
