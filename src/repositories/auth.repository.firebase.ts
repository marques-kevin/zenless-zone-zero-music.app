import { FirebaseService } from "@/services/firebase.service";
import { FirebaseUtils } from "@/utils/FirebaseUtils";
import {
  AuthenticateWithGoogleReponse,
  IAuthRepository,
  IsAuthenticatedReturnType,
} from "../interfaces/IAuthRepository";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { IRepositoryResponse } from "@/interfaces/IRepositoryResponse";
import { getDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export class AuthRepositoryFirebase
  extends FirebaseUtils
  implements IAuthRepository
{
  constructor(private firebase: FirebaseService) {
    super();
  }

  async authenticateWithGoogle(): Promise<AuthenticateWithGoogleReponse> {
    const auth = this.firebase.auth();
    const provider = this.firebase.getGoogleProvider();

    try {
      const response = await signInWithPopup(auth, provider);

      return {
        authenticated: true,
        user: {
          id: response.user?.uid as string,
          email: response.user?.email as string,
        },
      };
    } catch (e) {
      const error = e as {
        code:
          | "auth/expired-action-code"
          | "auth/invalid-email"
          | "auth/user-disabled";
      };

      const codes: {
        [key in typeof error.code]: any;
      } = {
        "auth/user-disabled": "USER_DISABLED",
        "auth/expired-action-code": "EMAIL_BAD_FORMATTED",
        "auth/invalid-email": "EMAIL_BAD_FORMATTED",
      };

      return {
        error: codes[error.code],
        authenticated: false,
      };
    }
  }

  async isAuthenticated(): Promise<IsAuthenticatedReturnType> {
    return new Promise((resolve, reject) => {
      const auth = this.firebase.auth();
      onAuthStateChanged(auth, function (user) {
        if (user)
          return resolve({
            authenticated: true,
            user: {
              id: user.uid,
              email: user.email as string,
            },
          });
        return resolve({ authenticated: false });
      });
    });
  }

  async set_profile_picture(payload: {
    profile_picture: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const userRef = doc(db, "users", payload.user_id);

      await setDoc(
        userRef,
        {
          profile_picture: payload.profile_picture,
        },
        { merge: true }
      );

      return {
        error: false,
        data: null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: error.message,
        message: error.message,
      };
    }
  }

  async get_profile_picture(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<string | null>> {
    try {
      const db = getFirestore(this.firebase.getInstance());
      const userRef = doc(db, "users", params.user_id);

      const userSnap = await getDoc(userRef);

      return {
        error: false,
        data: userSnap.data()?.profile_picture as string | null,
      };
    } catch (error: any) {
      return {
        error: true,
        code: error.message,
        message: error.message,
      };
    }
  }

  async logout() {
    try {
      const auth = this.firebase.auth();
      signOut(auth);

      return { succeed: true };
    } catch (e) {
      return { succeed: true };
    }
  }
}
