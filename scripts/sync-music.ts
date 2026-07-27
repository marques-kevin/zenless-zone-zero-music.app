import { readdir } from "fs/promises";
import { join } from "path";
import dotenv from "dotenv";
import {
  createR2Client,
  getR2Config,
  listR2MusicFiles,
  uploadMusicFileToR2,
} from "./lib/music-storage";

dotenv.config();

async function main() {
  const r2Config = getR2Config();

  if (!r2Config) {
    console.error(
      "Missing Cloudflare R2 credentials. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_ACCESS_KEY_ID, CLOUDFLARE_SECRET_ACCESS_KEY, and CLOUDFLARE_BUCKET_NAME in .env"
    );
    process.exit(1);
  }

  const s3Client = createR2Client(r2Config);

  try {
    console.log("Fetching files from R2...");
    const r2Files = await listR2MusicFiles(
      s3Client,
      r2Config.CLOUDFLARE_BUCKET_NAME
    );
    console.log(`Found ${r2Files.length} files in R2`);

    console.log("Reading local files...");
    const localFiles = await readdir("musics");
    console.log(`Found ${localFiles.length} local files`);

    const musicFiles = localFiles.filter(
      (file) => !file.startsWith(".") && file.endsWith(".mp3")
    );

    const missingFiles = musicFiles.filter(
      (file) => !r2Files.includes(`musics/${file}`)
    );

    console.log(`Found ${missingFiles.length} missing files`);
    console.log(missingFiles);

    for (const file of missingFiles) {
      const filePath = join("musics", file);
      await uploadMusicFileToR2(
        s3Client,
        r2Config.CLOUDFLARE_BUCKET_NAME,
        filePath
      );
      console.log(`Uploaded: musics/${file}`);
    }

    console.log("Sync completed successfully!");
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

main();
