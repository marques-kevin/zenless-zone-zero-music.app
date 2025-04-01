import { UserEntity } from "@/types/user";
import { IRepositoryResponse } from "./IRepositoryResponse";

export type AuthenticateReturnErrorType =
  | "EMAIL_BAD_FORMATTED"
  | "USER_DISABLED"
  | "USER_NOT_FOUND"
  | "BAD_PASSWORD";

export type AuthenticateReturnType =
  | {
      authenticated: true;
      user: UserEntity;
    }
  | {
      authenticated: false;
      error: AuthenticateReturnErrorType;
    };

export type AuthenticateWithLinkReturnErrorType =
  | "EXPIRED_CODE"
  | "INVALID_EMAIL"
  | "USER_DISABLED"
  | "ERROR_SERVER";

export type AuthenticateWithLinkReturnType =
  | {
      authenticated: true;
      user: UserEntity;
    }
  | {
      authenticated: false;
      sourceErrorCode?: string;
      error: AuthenticateWithLinkReturnErrorType;
    };

export type AuthenticateWithGoogleReponse =
  | {
      authenticated: true;
      user: UserEntity;
    }
  | {
      authenticated: false;
      sourceErrorCode?: string;
      error: AuthenticateWithLinkReturnErrorType;
    };

export type IsAuthenticatedReturnType =
  | {
      user: UserEntity;
      authenticated: true;
    }
  | {
      authenticated: false;
    };

export interface IAuthRepository {
  isAuthenticated(): Promise<IsAuthenticatedReturnType>;
  logout(): Promise<{ succeed: boolean }>;
  authenticateWithGoogle(): Promise<AuthenticateWithGoogleReponse>;
  set_profile_picture(payload: {
    profile_picture: string;
    user_id: string;
  }): Promise<IRepositoryResponse<null>>;
  get_profile_picture(params: {
    user_id: string;
  }): Promise<IRepositoryResponse<string | null>>;
}
