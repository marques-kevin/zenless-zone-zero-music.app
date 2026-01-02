import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptDir = __dirname;
const repoRoot = path.resolve(scriptDir, "..", "..");

const filesList = path.join(scriptDir, "files-to-download.txt");
const outDir = path.join(scriptDir, "files");
const dockerfilePath = path.join(
  repoRoot,
  "scripts/youtube-downloader",
  "ytmp3.dockerfile"
);
const imageName = "zzz-ytmp3";

function printUsage() {
  // Keep usage text close to the original Bash script
  console.log(
    [
      "YouTube to MP3 downloader (Docker-based)",
      "",
      "Usage:",
      `  ${path.basename(process.argv[1] || "download.ts")}`,
      "",
      "Behavior:",
      `  - Reads URLs from: ${filesList}`,
      `  - Writes MP3 files to: ${outDir}`,
      `  - Uses Docker image: ${imageName}`,
      "",
      "Notes:",
      "  - One URL per line.",
      "  - Lines starting with '#' or blank lines are ignored.",
    ].join("\n")
  );
}

async function runCommand(
  cmd: string,
  args: string[],
  options: { silent?: boolean } = {}
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: options.silent ? "ignore" : "inherit",
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });
  });
}

async function requireCmd(cmd: string) {
  try {
    const code = await runCommand(cmd, ["--version"], { silent: true });
    if (code !== 0) {
      throw new Error();
    }
  } catch {
    console.error(`Error: '${cmd}' is not installed or not in PATH.`);
    process.exit(1);
  }
}

async function ensureDockerImage() {
  // Check if image exists
  const inspectCode = await runCommand(
    "docker",
    ["image", "inspect", imageName],
    { silent: true }
  );

  if (inspectCode === 0) {
    return;
  }

  // Build image if missing
  try {
    await fs.access(dockerfilePath);
  } catch {
    console.error(`Error: Dockerfile not found at ${dockerfilePath}`);
    process.exit(1);
  }

  console.log(`Building Docker image '${imageName}'...`);
  const buildCode = await runCommand("docker", [
    "build",
    "-t",
    imageName,
    "-f",
    dockerfilePath,
    repoRoot,
  ]);

  if (buildCode !== 0) {
    console.error("Error: Failed to build Docker image.");
    process.exit(1);
  }
}

async function main() {
  if (process.argv[2] === "-h" || process.argv[2] === "--help") {
    printUsage();
    return;
  }

  await requireCmd("docker");

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

  await ensureDockerImage();

  console.log(`Output directory: ${outDir}`);
  console.log(`Total URLs: ${numUrls}`);
  console.log();

  let successCount = 0;
  let failCount = 0;
  const failedUrls: string[] = [];

  for (const url of urls) {
    console.log(`Downloading: ${url}`);

    const code = await runCommand("docker", [
      "run",
      "--rm",
      "-v",
      `${outDir}:/out`,
      imageName,
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
      "/out/%(title)s.%(ext)s",
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
