import * as types from "./types";

interface State {
  current_git_version: string | null;
  deployed_git_version: string | null;
  deployed_at: Date | null;
}

const initialState: State = {
  current_git_version: null,
  deployed_git_version: null,
  deployed_at: null,
};

export function globalReducer(
  state = initialState,
  action: types.GlobalActionTypes
): State {
  if (action.type === types.global_set_deployed_git_version) {
    return {
      ...state,
      deployed_git_version: action.payload.deployed_git_version,
      deployed_at: action.payload.deployed_at,
    };
  }

  if (action.type === types.global_set_current_git_version) {
    return {
      ...state,
      current_git_version: action.payload.current_git_version,
    };
  }

  return state;
}
