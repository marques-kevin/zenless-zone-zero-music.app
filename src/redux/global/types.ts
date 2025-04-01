export const global_set_current_git_version = "global_set_current_git_version";
export interface global_set_current_git_version_action {
  type: typeof global_set_current_git_version;
  payload: {
    current_git_version: string | null;
  };
}

export const global_set_deployed_git_version =
  "global_set_deployed_git_version";
export interface global_set_deployed_git_version_action {
  type: typeof global_set_deployed_git_version;
  payload: {
    deployed_git_version: string | null;
    deployed_at: Date | null;
  };
}

export type GlobalActionTypes =
  | global_set_current_git_version_action
  | global_set_deployed_git_version_action;
