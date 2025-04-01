import { tracks } from "@/database/tracks";
import * as types from "./types";
import { RootState } from "../store";
import { ThunkDispatch } from "redux-thunk";
import { navigate } from "@reach/router";
import { all_playlists } from "@/database/playlists";
import { addHash, removeHash } from "@/lib/utils";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { actions } from "../actions";

export const news_set_last_time_news_was_seen = (
  payload: types.news_set_last_time_news_was_seen_action["payload"]
): types.NewsActionTypes => ({
  type: types.news_set_last_time_news_was_seen,
  payload,
});

export const $fetch_if_news_has_been_seen = () => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.NewsActionTypes>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    const item = await di.LocalstorageService.getItem(
      "last_time_news_was_seen"
    );

    dispatch(
      news_set_last_time_news_was_seen({
        last_time_news_was_seen: item ? new Date(item) : null,
      })
    );
  };
};

export const $open_news_modal = () => {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, types.NewsActionTypes>,
    getState: () => RootState
  ) => {
    const { di } = getState();

    dispatch(actions.modals.$open({ key: MODAL_KEYS.news }));

    const last_time_news_was_seen = new Date();

    di.LocalstorageService.setItem(
      "last_time_news_was_seen",
      last_time_news_was_seen.toISOString()
    );

    dispatch(
      news_set_last_time_news_was_seen({
        last_time_news_was_seen: last_time_news_was_seen,
      })
    );
  };
};
