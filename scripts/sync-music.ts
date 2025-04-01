import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { createReadStream } from "fs";

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME;

if (
  !R2_ACCOUNT_ID ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_BUCKET_NAME
) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function listR2Files(): Promise<string[]> {
  const files: string[] = [];
  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    if (response.Contents) {
      files.push(...response.Contents.map((item) => item.Key || ""));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
}

async function uploadFile(filePath: string): Promise<void> {
  const fileStream = createReadStream(filePath);
  const key = `musics/${filePath.split("/").pop()}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: "audio/mpeg",
  });

  await s3Client.send(command);
  console.log(`Uploaded: ${key}`);
}

async function main() {
  try {
    // Get list of files in R2
    console.log("Fetching files from R2...");
    const r2Files = await listR2Files();
    console.log(`Found ${r2Files.length} files in R2`);

    // Get list of local files
    console.log("Reading local files...");
    const localFiles = await readdir("musics");
    console.log(`Found ${localFiles.length} local files`);

    // Filter out .DS_Store and other hidden files
    const musicFiles = localFiles.filter(
      (file) => !file.startsWith(".") && file.endsWith(".mp3")
    );

    // Find missing files
    const missingFiles = musicFiles.filter(
      (file) => !r2Files.includes(`musics/${file}`)
    );

    console.log(`Found ${missingFiles.length} missing files`);

    // Upload missing files
    for (const file of missingFiles) {
      const filePath = join("musics", file);
      await uploadFile(filePath);
    }

    console.log("Sync completed successfully!");
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

main();
