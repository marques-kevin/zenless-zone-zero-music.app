import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ensureDockerImage, requireCmd, ytdlpPrint } from "./ytdlp-docker";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptDir = __dirname;
const filesList = path.join(scriptDir, "files-to-download.txt");

function printUsage() {
  console.log(
    [
      "Extract YouTube playlist URLs (Docker-based)",
      "",
      "Usage:",
      `  yarn playlist <playlist-url>`,
      "",
      "Behavior:",
      "  - Extracts all video URLs from the given playlist",
      `  - Writes them to: ${filesList}`,
      "",
      "Example:",
      '  yarn playlist "https://www.youtube.com/playlist?list=PLxxxx"',
    ].join("\n")
  );
}

async function extractPlaylistUrls(playlistUrl: string): Promise<string[]> {
  const stdout = await ytdlpPrint(playlistUrl, "%(url)s");

  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function main() {
  const playlistUrl = process.argv[2];

  if (!playlistUrl || playlistUrl === "-h" || playlistUrl === "--help") {
    printUsage();
    process.exit(playlistUrl ? 0 : 1);
  }

  await requireCmd("docker");
  await ensureDockerImage();

  console.log(`Extracting URLs from: ${playlistUrl}`);

  const urls = await extractPlaylistUrls(playlistUrl);

  if (urls.length === 0) {
    console.error("Error: No URLs found in playlist.");
    process.exit(1);
  }

  await fs.writeFile(filesList, `${urls.join("\n")}\n`, "utf8");

  console.log(`Wrote ${urls.length} URL(s) to ${filesList}`);
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
