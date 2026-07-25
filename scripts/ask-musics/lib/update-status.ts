import { FieldValue } from "firebase-admin/firestore";
import { AskMusicStatus } from "../../../src/types/ask-music.type";
import {
  decode_url_from_firestore_doc_id,
  encode_url_as_firestore_doc_id,
  normalize_youtube_url,
} from "../../../src/utils/youtube-url";
import { ASK_MUSICS_COLLECTION, firestore_db } from "../firebase-admin";
import { AskMusicDoc, AskMusicRequest, map_doc_to_request } from "../types";

export async function updateRequestStatus(params: {
  url?: string;
  id?: string;
  status: AskMusicStatus;
  reason?: string;
}): Promise<AskMusicRequest> {
  if (!params.id && !params.url) {
    throw new Error("Provide either url or id");
  }

  if (params.id && params.url) {
    throw new Error("Use only one of url or id");
  }

  if (params.status === "cancelled" && !params.reason?.trim()) {
    throw new Error('A reason is required when status is "cancelled"');
  }

  const doc_id = params.id
    ? params.id
    : encode_url_as_firestore_doc_id(normalize_youtube_url(params.url!)!);

  const doc_ref = firestore_db.collection(ASK_MUSICS_COLLECTION).doc(doc_id);
  const snapshot = await doc_ref.get();

  if (!snapshot.exists) {
    const lookup =
      params.url ?? decode_url_from_firestore_doc_id(doc_id);
    throw new Error(`No music request found for: ${lookup}`);
  }

  const update_payload: Record<string, unknown> = {
    status: params.status,
    updated_at: FieldValue.serverTimestamp(),
  };

  if (params.status === "cancelled") {
    update_payload.cancel_reason = params.reason!.trim();
  } else {
    update_payload.cancel_reason = FieldValue.delete();
  }

  await doc_ref.update(update_payload);

  const updated_snapshot = await doc_ref.get();
  return map_doc_to_request(
    updated_snapshot.id,
    updated_snapshot.data() as AskMusicDoc
  );
}
