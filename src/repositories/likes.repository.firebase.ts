import { FirebaseService } from "@/services/firebase.service";
import { FirebaseUtils } from "@/utils/FirebaseUtils";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

import { ILikesRepository } from "@/interfaces/ILikesRepository";
import { TrackWithLikes } from "@/types/track.type";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";

type LikeDocEntry = {
  id: string;
  users: string[];
};

export class LikesRepositoryFirebase
  extends FirebaseUtils
  implements ILikesRepository
{
  constructor(private firebase: FirebaseService) {
    super();
  }

  async fetch_user_liked_titles(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<string[]>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const likes_ref = collection(db, "likes");
      const likes_docs = await getDocs(likes_ref);
      const likes_data = likes_docs.docs.map((doc) => doc.data()) as {
        id: string;
        users: string[];
      }[];

      return {
        error: false,
        data: likes_data
          .filter((like) => like.users.includes(params.user_id))
          .map((like) => like.id),
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

  async fetch_all_tracks_with_likes(): Promise<
    IRepositoryResponse<TrackWithLikes[]>
  > {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const likes_ref = collection(db, "likes");
      const likes_docs = await getDocs(likes_ref);
      const likes_data = likes_docs.docs.map((doc) => doc.data()) as {
        id: string;
        users: string[];
      }[];

      const tracks_with_likes: TrackWithLikes[] = likes_data.map((like) => {
        return {
          title_id: like.id,
          number_of_likes: like.users.length,
        };
      });

      return {
        error: false,
        data: tracks_with_likes,
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

  async get_one_track_with_likes(params: {
    title_id: string;
  }): Promise<LikeDocEntry> {
    const db = getFirestore(this.firebase.getInstance());
    const likes_ref = collection(db, "likes");
    const likes_doc = doc(likes_ref, params.title_id);
    const likes_data = (await getDoc(likes_doc)).data() as {
      id: string;
      users: string[];
    };

    return {
      id: likes_data?.id || params.title_id,
      users: likes_data?.users || [],
    };
  }

  async store_user_liked_title(params: {
    user_id: string;
    title_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const likes_ref = collection(db, "likes");
      const likes_track_ref = doc(likes_ref, params.title_id);

      const likes_data = await this.get_one_track_with_likes({
        title_id: params.title_id,
      });

      await setDoc(
        likes_track_ref,
        {
          users: [...(likes_data.users || []), params.user_id],
          id: params.title_id,
        },
        { merge: true }
      );

      return {
        error: false,
        data: null,
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

  async delete_user_liked_title(params: {
    user_id: string;
    title_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const likes_ref = collection(db, "likes");
      const likes_track_ref = doc(likes_ref, params.title_id);

      const likes_data = await this.get_one_track_with_likes({
        title_id: params.title_id,
      });

      await setDoc(
        likes_track_ref,
        {
          users: likes_data.users.filter((user) => user !== params.user_id),
          id: params.title_id,
        },
        { merge: true }
      );

      return {
        error: false,
        data: null,
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
