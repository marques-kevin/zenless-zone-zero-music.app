import {
  CATALOG_LOCAL_PATH,
  CATALOG_R2_KEY,
  downloadCatalogFromR2,
  writeLocalCatalog,
} from "./r2";

function printUsage() {
  console.log(
    [
      "Download the remote catalog from R2 to catalog/tracks.json",
      "",
      "Usage:",
      "  yarn catalog:pull",
    ].join("\n")
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }

  try {
    const remoteContent = await downloadCatalogFromR2();

    if (!remoteContent) {
      console.error("No remote catalog found on R2.");
      process.exit(1);
    }

    await writeLocalCatalog(remoteContent);
    console.log(`Catalog pulled from ${CATALOG_R2_KEY} to ${CATALOG_LOCAL_PATH}`);
  } catch (error) {
    console.error("Error pulling catalog:", error);
    process.exit(1);
  }
}

main();
