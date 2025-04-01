import { UserEntity } from "@/types/user";

export const auth_logout = "auth_logout";
export interface auth_logout_action {
  type: typeof auth_logout;
}

export const auth_authenticate = "auth_authenticate";
export interface auth_authenticate_action {
  type: typeof auth_authenticate;
  payload: {
    user: UserEntity;
  };
}

export const auth_set_profile_picture = "auth_set_profile_picture";
export interface auth_set_profile_picture_action {
  type: typeof auth_set_profile_picture;
  payload: {
    profile_picture: string;
  };
}

export type AuthActionTypes =
  | auth_logout_action
  | auth_authenticate_action
  | auth_set_profile_picture_action;
