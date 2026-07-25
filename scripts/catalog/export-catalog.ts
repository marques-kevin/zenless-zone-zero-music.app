import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { buildCatalog } from "./build-catalog";

const OUTPUT_PATH = join(process.cwd(), "catalog/tracks.json");

function printUsage() {
  console.log(
    [
      "Export the local TypeScript catalog to catalog/tracks.json",
      "",
      "Usage:",
      "  yarn catalog:export",
    ].join("\n")
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }

  try {
    const catalog = buildCatalog();
    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, JSON.stringify(catalog, null, 2), "utf8");

    console.log(`Catalog exported to ${OUTPUT_PATH}`);
    console.log(`Tracks: ${catalog.tracks.length}`);
    console.log(`Playlists: ${catalog.playlists.official.length}`);
  } catch (error) {
    console.error("Error exporting catalog:", error);
    process.exit(1);
  }
}

main();
