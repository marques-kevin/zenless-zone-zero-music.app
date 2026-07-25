import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";

dotenv.config();

const ENV_SCHEMA = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
});

const env = ENV_SCHEMA.parse(process.env);

export const CATALOG_LOCAL_PATH = join(process.cwd(), "catalog/tracks.json");
export const CATALOG_R2_KEY = "catalog/tracks.json";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export async function readLocalCatalog(): Promise<string> {
  return readFile(CATALOG_LOCAL_PATH, "utf8");
}

export async function writeLocalCatalog(content: string): Promise<void> {
  await writeFile(CATALOG_LOCAL_PATH, content, "utf8");
}

export async function downloadCatalogFromR2(): Promise<string | null> {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: CATALOG_R2_KEY,
      })
    );

    return (await response.Body?.transformToString()) ?? null;
  } catch (error: any) {
    if (error?.name === "NoSuchKey") {
      return null;
    }

    throw error;
  }
}

export async function uploadCatalogToR2(content: string): Promise<void> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: CATALOG_R2_KEY,
      Body: content,
      ContentType: "application/json",
    })
  );
}

export async function listR2Files(): Promise<string[]> {
  const files: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      files.push(...response.Contents.map((item) => item.Key || ""));
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
}
