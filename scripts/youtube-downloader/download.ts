import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getYtdlpExtraArgs } from "./ytdlp-cookies";
import { requireCmd, runCommand, ytdlpBin } from "./ytdlp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptDir = __dirname;

const filesList = path.join(scriptDir, "files-to-download.txt");
const outDir = path.join(scriptDir, "files");

function printUsage() {
  console.log(
    [
      "YouTube to MP3 downloader (yt-dlp)",
      "",
      "Usage:",
      `  ${path.basename(process.argv[1] || "download.ts")}`,
      "",
      "Behavior:",
      `  - Reads URLs from: ${filesList}`,
      `  - Writes MP3 files to: ${outDir}`,
      `  - Uses the local '${ytdlpBin}' binary`,
      "",
      "Notes:",
      "  - One URL per line.",
      "  - Lines starting with '#' or blank lines are ignored.",
    ].join("\n")
  );
}

async function main() {
  if (process.argv[2] === "-h" || process.argv[2] === "--help") {
    printUsage();
    return;
  }

  await requireCmd(ytdlpBin);

  await fs.mkdir(outDir, { recursive: true });

  // Ensure URL file exists
  try {
    await fs.access(filesList);
  } catch {
    console.error(`Error: URL file not found: ${filesList}`);
    console.error("Create it and add one URL per line.");
    process.exit(1);
  }

  // Read and filter URLs (non-empty, non-comment)
  const content = await fs.readFile(filesList, "utf8");
  const lines = content.split(/\r?\n/);
  const urls = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  const numUrls = urls.length;
  if (numUrls === 0) {
    console.error(`Error: No URLs found in ${filesList}`);
    process.exit(1);
  }

  console.log(`Output directory: ${outDir}`);
  console.log(`Total URLs: ${numUrls}`);
  console.log();

  let successCount = 0;
  let failCount = 0;
  const failedUrls: string[] = [];

  for (const url of urls) {
    console.log(`Downloading: ${url}`);

    const code = await runCommand(ytdlpBin, [
      ...(await getYtdlpExtraArgs()),
      "--no-progress",
      "--ignore-errors",
      "--continue",
      "--no-playlist",
      "--restrict-filenames",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--add-metadata",
      "-o",
      path.join(outDir, "%(title)s.%(ext)s"),
      url,
    ]);

    if (code === 0) {
      successCount += 1;
      console.log("✓ Done");
    } else {
      failCount += 1;
      failedUrls.push(url);
      console.error(`✗ Failed: ${url}`);
    }

    console.log();
  }

  console.log(`Completed. Success: ${successCount}, Failed: ${failCount}`);
  
  if (failedUrls.length > 0) {
    console.log();
    console.log("Failed URLs:");
    failedUrls.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
