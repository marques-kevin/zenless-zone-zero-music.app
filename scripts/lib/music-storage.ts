import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createReadStream, createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { z } from "zod";
import { Tracks } from "../../src/database/tracks";

export const MUSIC_CDN_BASE_URL =
  "https://pub-c6d74e47e1734ec0af83f0e20518da2c.r2.dev";

const R2_ENV_SCHEMA = z.object({
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_BUCKET_NAME: z.string().min(1),
});

export type R2Config = z.infer<typeof R2_ENV_SCHEMA>;

export function getR2Config(): R2Config | null {
  const result = R2_ENV_SCHEMA.safeParse(process.env);
  return result.success ? result.data : null;
}

export function createR2Client(config: R2Config): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.CLOUDFLARE_ACCESS_KEY_ID,
      secretAccessKey: config.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
  });
}

export async function listR2MusicFiles(
  client: S3Client,
  bucketName: string
): Promise<string[]> {
  const files: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: "musics/",
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      files.push(
        ...response.Contents.map((item) => item.Key || "").filter(Boolean)
      );
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
}

export function listMusicFilesFromDatabase(): string[] {
  const sources = new Set(
    Tracks.map((track) => track.source).filter((source) =>
      source.startsWith("/musics/")
    )
  );

  return [...sources].map((source) => source.slice(1));
}

export async function getMusicFileList(): Promise<{
  files: string[];
  source: "r2" | "database";
}> {
  const r2Config = getR2Config();

  if (r2Config) {
    const client = createR2Client(r2Config);
    const files = await listR2MusicFiles(client, r2Config.CLOUDFLARE_BUCKET_NAME);

    return { files, source: "r2" };
  }

  return { files: listMusicFilesFromDatabase(), source: "database" };
}

export function musicKeyToLocalPath(key: string): string {
  return join(process.cwd(), key);
}

export async function downloadMusicFileFromR2(
  client: S3Client,
  bucketName: string,
  key: string,
  localPath: string
): Promise<void> {
  const response = await client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );

  if (!response.Body) {
    throw new Error(`Empty response for ${key}`);
  }

  await mkdir(dirname(localPath), { recursive: true });
  await pipeline(response.Body as Readable, createWriteStream(localPath));
}

export async function downloadMusicFileFromCdn(
  key: string,
  localPath: string
): Promise<void> {
  const response = await fetch(`${MUSIC_CDN_BASE_URL}/${key}`);

  if (!response.ok) {
    throw new Error(`Failed to download ${key}: ${response.status}`);
  }

  if (!response.body) {
    throw new Error(`Empty response for ${key}`);
  }

  await mkdir(dirname(localPath), { recursive: true });
  await pipeline(Readable.fromWeb(response.body as never), createWriteStream(localPath));
}

export async function uploadMusicFileToR2(
  client: S3Client,
  bucketName: string,
  filePath: string
): Promise<void> {
  const fileStream = createReadStream(filePath);
  const key = `musics/${filePath.split("/").pop()}`;

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
      ContentType: "audio/mpeg",
    })
  );
}
