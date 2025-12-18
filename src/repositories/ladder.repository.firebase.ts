import { FirebaseService } from "@/services/firebase.service";
import { FirebaseUtils } from "@/utils/FirebaseUtils";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  ILadderRepository,
  LadderSelection,
} from "@/interfaces/ILadderRepository";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";

export class LadderRepositoryFirebase
  extends FirebaseUtils
  implements ILadderRepository
{
  constructor(private firebase: FirebaseService) {
    super();
  }

  private getCollectionRef() {
    const db = getFirestore(this.firebase.getInstance());
    return collection(db, "ladders");
  }

  async fetch_selection(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<LadderSelection>> {
    try {
      const ladder_ref = this.getCollectionRef();
      const doc_ref = doc(ladder_ref, params.user_id);
      const snapshot = await getDoc(doc_ref);

      if (!snapshot.exists()) {
        return {
          error: false,
          data: {
            characters: [],
          },
        };
      }

      const data = snapshot.data() as { characters?: string[] } | undefined;
      const characters = data?.characters || [];

      const entry: LadderSelection = {
        characters: characters,
      };

      return {
        error: false,
        data: entry,
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

  async store_selection(params: {
    user_id: string;
    selection: string[];
  }): Promise<IRepositoryResponse<LadderSelection>> {
    try {
      const ladder_ref = this.getCollectionRef();
      const doc_ref = doc(ladder_ref, params.user_id);

      await setDoc(doc_ref, { characters: params.selection });

      const entry: LadderSelection = {
        characters: params.selection,
      };

      return {
        error: false,
        data: entry,
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
