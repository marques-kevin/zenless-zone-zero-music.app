import { readFile } from "fs/promises";
import {
  CATALOG_LOCAL_PATH,
  CATALOG_R2_KEY,
  uploadCatalogToR2,
} from "./r2";

const args = new Set(process.argv.slice(2));
const is_dry_run = args.has("--dry-run");

function printUsage() {
  console.log(
    [
      "Upload catalog/tracks.json to Cloudflare R2",
      "",
      "Usage:",
      "  yarn catalog:sync [--dry-run]",
    ].join("\n")
  );
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    const content = await readFile(CATALOG_LOCAL_PATH, "utf8");

    if (is_dry_run) {
      console.log(`[dry-run] Would upload ${CATALOG_R2_KEY}`);
      return;
    }

    await uploadCatalogToR2(content);
    console.log(`Catalog uploaded to ${CATALOG_R2_KEY}`);
  } catch (error) {
    console.error("Error syncing catalog:", error);
    process.exit(1);
  }
}

main();
