import { Timestamp } from "firebase-admin/firestore";
import { AskMusicStatus } from "../../src/types/ask-music.type";

export type AskMusicDoc = {
  url: string;
  users: string[];
  status: AskMusicStatus;
  cancel_reason?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type AskMusicRequest = {
  id: string;
  url: string;
  users: string[];
  status: AskMusicStatus;
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
};

export type PendingRequestsManifest = {
  checked_at: string;
  total_pending: number;
  requests: AskMusicRequest[];
};

export function map_doc_to_request(
  id: string,
  data: AskMusicDoc
): AskMusicRequest {
  return {
    id,
    url: data.url,
    users: data.users || [],
    status: data.status || "pending",
    cancel_reason: data.cancel_reason,
    created_at: data.created_at.toDate().toISOString(),
    updated_at: data.updated_at.toDate().toISOString(),
  };
}
