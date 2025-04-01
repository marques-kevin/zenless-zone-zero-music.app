import * as types from "./types";
import { RootState } from "../store";
import { ThunkDispatch } from "redux-thunk";
import { AnalyticsEntity } from "@/types/analytics.type";
import { extract_hash_value } from "@/hooks/use-modal";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { actions } from "../actions";
import { tracks } from "@/database/tracks";

export const set_current_git_version = (
  payload: types.global_set_current_git_version_action["payload"]
): types.GlobalActionTypes => ({
  type: types.global_set_current_git_version,
  payload,
});

export const set_deployed_git_version = (
  payload: types.global_set_deployed_git_version_action["payload"]
): types.GlobalActionTypes => ({
  type: types.global_set_deployed_git_version,
  payload,
});

export const $fetch_if_update_is_available = (
  payload: types.global_set_current_git_version_action["payload"]
) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.GlobalActionTypes>,
    getState: () => RootState
  ) => {
    dispatch(set_current_git_version(payload));

    const request = await fetch("/version.json");

    const data: {
      version: string;
      build_time: string;
    } = await request.json();

    dispatch(
      set_deployed_git_version({
        deployed_git_version: data.version,
        deployed_at: new Date(data.build_time),
      })
    );
  };
};

export const $reload = () => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.GlobalActionTypes>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    di.AnalyticsService.send({
      category: "global",
      action: "reload",
    });

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
};

export const $analytics = (payload: AnalyticsEntity) => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.GlobalActionTypes>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    di.AnalyticsService.send(payload);
  };
};

export const $select_current_track_by_url = () => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    const value = extract_hash_value({
      hash: window.location.hash,
      key: MODAL_KEYS.player,
    });

    if (!value) return;

    const track = tracks.find((track) => track.title_id === value);

    if (!track) return;

    dispatch(
      actions.player.player_store_current_track({
        track,
      })
    );
  };
};

export const $copy_track_share_url = (payload: { track_id: string }) => {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    const url = `${window.location.origin}/?utm_source=share&utm_medium=copy#player=${payload.track_id}`;

    navigator.clipboard.writeText(url);

    alert("The url has been copied to your clipboard, you can share it now.");
  };
};
