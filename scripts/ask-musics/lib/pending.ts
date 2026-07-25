import { writeFile } from "fs/promises";
import { join } from "path";
import { ASK_MUSICS_COLLECTION, firestore_db } from "../firebase-admin";
import {
  AskMusicDoc,
  AskMusicRequest,
  map_doc_to_request,
  PendingRequestsManifest,
} from "../types";

export const PENDING_MANIFEST_PATH = join(
  process.cwd(),
  "scripts/ask-musics/pending-requests.json"
);

export async function fetchPendingRequests(): Promise<AskMusicRequest[]> {
  const snapshot = await firestore_db
    .collection(ASK_MUSICS_COLLECTION)
    .where("status", "==", "pending")
    .get();

  return snapshot.docs
    .map((doc) => map_doc_to_request(doc.id, doc.data() as AskMusicDoc))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
}

export async function writePendingManifest(
  requests: AskMusicRequest[]
): Promise<void> {
  const manifest: PendingRequestsManifest = {
    checked_at: new Date().toISOString(),
    total_pending: requests.length,
    requests,
  };

  await writeFile(
    PENDING_MANIFEST_PATH,
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
}
