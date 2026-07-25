import { FirebaseService } from "@/services/firebase.service";
import { FirebaseUtils } from "@/utils/FirebaseUtils";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import {
  IAskMusicsRepository,
  SubmitAskMusicResult,
} from "@/interfaces/IAskMusicsRepository";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";
import { AskMusic, AskMusicStatus } from "@/types/ask-music.type";
import {
  encode_url_as_firestore_doc_id,
  normalize_youtube_url,
} from "@/utils/youtube-url";

type AskMusicDoc = {
  url: string;
  users: string[];
  status: AskMusicStatus;
  cancel_reason?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

const map_doc_to_ask_music = (data: AskMusicDoc): AskMusic => ({
  url: data.url,
  users: data.users || [],
  status: data.status || "pending",
  cancel_reason: data.cancel_reason,
  created_at: data.created_at.toDate(),
  updated_at: data.updated_at.toDate(),
});

export class AskMusicsRepositoryFirebase
  extends FirebaseUtils
  implements IAskMusicsRepository
{
  constructor(private firebase: FirebaseService) {
    super();
  }

  private get_collection_ref() {
    const db = getFirestore(this.firebase.getInstance());
    return collection(db, "ask-musics");
  }

  private async get_one(params: { url: string }): Promise<AskMusicDoc | null> {
    const ask_musics_ref = this.get_collection_ref();
    const doc_ref = doc(ask_musics_ref, encode_url_as_firestore_doc_id(params.url));
    const snapshot = await getDoc(doc_ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as AskMusicDoc;
  }

  async submit_requests(params: {
    user_id: string;
    urls: string[];
  }): Promise<IRepositoryResponse<SubmitAskMusicResult>> {
    try {
      const ask_musics_ref = this.get_collection_ref();
      const submitted_urls: string[] = [];
      const already_requested_urls: string[] = [];
      const invalid_lines: string[] = [];

      for (const raw_url of params.urls) {
        const normalized_url = normalize_youtube_url(raw_url);

        if (!normalized_url) {
          invalid_lines.push(raw_url);
          continue;
        }

        const doc_ref = doc(
          ask_musics_ref,
          encode_url_as_firestore_doc_id(normalized_url)
        );
        const existing = await this.get_one({ url: normalized_url });
        const now = Timestamp.now();

        if (existing) {
          if (existing.users.includes(params.user_id)) {
            already_requested_urls.push(normalized_url);
            continue;
          }

          await setDoc(
            doc_ref,
            {
              users: [...existing.users, params.user_id],
              updated_at: now,
            },
            { merge: true }
          );
        } else {
          await setDoc(doc_ref, {
            url: normalized_url,
            users: [params.user_id],
            status: "pending",
            created_at: now,
            updated_at: now,
          });
        }

        submitted_urls.push(normalized_url);
      }

      return {
        error: false,
        data: {
          submitted_urls,
          already_requested_urls,
          invalid_lines,
        },
      };
    } catch (error: any) {
      console.error(error);

      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }

  async fetch_user_requests(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<AskMusic[]>> {
    try {
      const ask_musics_ref = this.get_collection_ref();
      const user_requests_query = query(
        ask_musics_ref,
        where("users", "array-contains", params.user_id)
      );
      const snapshots = await getDocs(user_requests_query);

      const requests = snapshots.docs
        .map((snapshot) => map_doc_to_ask_music(snapshot.data() as AskMusicDoc))
        .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());

      return {
        error: false,
        data: requests,
      };
    } catch (error: any) {
      console.error(error);

      return {
        error: true,
        code: "UNKNOWN_ERROR",
        message: error.message,
      };
    }
  }
}
