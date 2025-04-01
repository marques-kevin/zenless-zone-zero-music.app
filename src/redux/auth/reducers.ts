import { UserEntity } from "@/types/user";
import * as types from "./types";

interface State {
  user: UserEntity | null;
  authenticated: boolean;
  profile_picture: string | null;
}

const initialState: State = {
  user: null,
  authenticated: false,
  profile_picture: null,
};

export function authReducer(
  state = initialState,
  action: types.AuthActionTypes
): State {
  if (action.type === types.auth_authenticate) {
    return {
      ...state,
      authenticated: true,
      user: action.payload.user,
    };
  }

  if (action.type === types.auth_logout) {
    return { ...initialState };
  }

  if (action.type === types.auth_set_profile_picture) {
    return {
      ...state,
      profile_picture: action.payload.profile_picture,
    };
  }

  return state;
}
