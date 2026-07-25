import { readFile } from "fs/promises";
import {
  assertSafeToUpload,
  parseCatalogJson,
} from "./catalog-utils";
import {
  CATALOG_LOCAL_PATH,
  CATALOG_R2_KEY,
  downloadCatalogFromR2,
  uploadCatalogToR2,
} from "./r2";

const args = new Set(process.argv.slice(2));
const is_dry_run = args.has("--dry-run");
const is_force = args.has("--force");

function printUsage() {
  console.log(
    [
      "Upload catalog/tracks.json to Cloudflare R2",
      "",
      "Usage:",
      "  yarn catalog:sync [--dry-run] [--force]",
      "",
      "Safety:",
      "  - Refuses to upload if local catalog is older or smaller than remote",
      "  - Use --force to overwrite remote anyway",
      "  - Prefer `yarn catalog:add-track --remote` for async additions",
    ].join("\n")
  );
}

async function main() {
  if (args.has("--help") || args.has("-h")) {
    printUsage();
    return;
  }

  try {
    const localContent = await readFile(CATALOG_LOCAL_PATH, "utf8");
    const localCatalog = parseCatalogJson(localContent);
    const remoteContent = await downloadCatalogFromR2();
    const remoteCatalog = remoteContent ? parseCatalogJson(remoteContent) : null;

    assertSafeToUpload({
      local: localCatalog,
      remote: remoteCatalog,
      force: is_force,
    });

    if (is_dry_run) {
      console.log(`[dry-run] Would upload ${CATALOG_R2_KEY}`);
      return;
    }

    await uploadCatalogToR2(localContent);
    console.log(`Catalog uploaded to ${CATALOG_R2_KEY}`);
  } catch (error) {
    console.error("Error syncing catalog:", error);
    process.exit(1);
  }
}

main();
