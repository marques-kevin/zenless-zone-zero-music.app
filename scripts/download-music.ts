import { access } from "fs/promises";
import dotenv from "dotenv";
import {
  createR2Client,
  downloadMusicFileFromCdn,
  downloadMusicFileFromR2,
  getMusicFileList,
  getR2Config,
  musicKeyToLocalPath,
} from "./lib/music-storage";

dotenv.config();

const CONCURRENCY = 8;

type CliOptions = {
  force: boolean;
  dryRun: boolean;
};

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);

  return {
    force: args.includes("--force"),
    dryRun: args.includes("--dry-run"),
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>
): Promise<void> {
  let currentIndex = 0;

  async function runWorker(): Promise<void> {
    while (currentIndex < items.length) {
      const index = currentIndex;
      currentIndex += 1;
      await worker(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker())
  );
}

async function main() {
  const options = parseArgs();

  console.log("Fetching music file list...");
  const { files, source } = await getMusicFileList();
  console.log(`Found ${files.length} files from ${source}`);

  const filesToDownload: string[] = [];

  for (const key of files) {
    const localPath = musicKeyToLocalPath(key);

    if (!options.force && (await fileExists(localPath))) {
      continue;
    }

    filesToDownload.push(key);
  }

  console.log(`${filesToDownload.length} files to download`);

  if (options.dryRun) {
    filesToDownload.forEach((key) => console.log(`Would download: ${key}`));
    return;
  }

  if (filesToDownload.length === 0) {
    console.log("All music files are already present locally.");
    return;
  }

  const r2Config = getR2Config();
  const r2Client = r2Config ? createR2Client(r2Config) : null;
  let completed = 0;
  let failed = 0;

  await runWithConcurrency(filesToDownload, CONCURRENCY, async (key) => {
    const localPath = musicKeyToLocalPath(key);

    try {
      if (r2Client && r2Config) {
        await downloadMusicFileFromR2(
          r2Client,
          r2Config.CLOUDFLARE_BUCKET_NAME,
          key,
          localPath
        );
      } else {
        await downloadMusicFileFromCdn(key, localPath);
      }

      completed += 1;
      console.log(`[${completed + failed}/${filesToDownload.length}] Downloaded: ${key}`);
    } catch (error) {
      failed += 1;
      console.error(`[${completed + failed}/${filesToDownload.length}] Failed: ${key}`, error);
    }
  });

  console.log(`Download finished: ${completed} succeeded, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Error during download:", error);
  process.exit(1);
});
