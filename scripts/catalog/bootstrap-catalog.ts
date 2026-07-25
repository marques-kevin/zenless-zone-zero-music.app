import { buildCatalogFromTypescript, getCatalogStats } from "./catalog-utils";
import { saveRemoteCatalog } from "./catalog-store";
import { downloadCatalogFromR2 } from "./r2";

function printUsage() {
  console.log(
    [
      "Initialize the remote catalog from the local TypeScript database",
      "",
      "Usage:",
      "  yarn catalog:bootstrap",
      "",
      "This command only works when no catalog exists on R2 yet.",
      "After bootstrap, use CRUD commands to modify tracks and playlists.",
    ].join("\n")
  );
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printUsage();
    return;
  }

  try {
    const existing = await downloadCatalogFromR2();

    if (existing) {
      const remote = JSON.parse(existing);
      const stats = getCatalogStats(remote);
      throw new Error(
        [
          "Remote catalog already exists. Bootstrap is not allowed.",
          `Remote: v${stats.version} (${stats.track_count} tracks)`,
          "Use CRUD commands instead: add-track, update-track, remove-track, update-playlist.",
        ].join("\n")
      );
    }

    const catalog = buildCatalogFromTypescript();
    await saveRemoteCatalog(catalog);

    const stats = getCatalogStats(catalog);
    console.log("Remote catalog bootstrapped successfully");
    console.log(`Version: ${stats.version}`);
    console.log(`Tracks: ${stats.track_count}`);
    console.log(`Playlists: ${stats.playlist_count}`);
  } catch (error) {
    console.error("Error bootstrapping catalog:", error);
    process.exit(1);
  }
}

main();
