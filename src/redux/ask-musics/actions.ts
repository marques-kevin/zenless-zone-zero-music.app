import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import * as types from "./types";
import { actions } from "../actions";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { parse_youtube_urls_from_text } from "@/utils/youtube-url";

export const ask_musics_store_requests = (
  payload: types.ask_musics_store_requests_action["payload"]
): types.AskMusicsActionTypes => ({
  type: types.ask_musics_store_requests,
  payload,
});

export const ask_musics_set_fetching_requests = (
  payload: types.ask_musics_set_fetching_requests_action["payload"]
): types.AskMusicsActionTypes => ({
  type: types.ask_musics_set_fetching_requests,
  payload,
});

export const ask_musics_set_fetching_submit = (
  payload: types.ask_musics_set_fetching_submit_action["payload"]
): types.AskMusicsActionTypes => ({
  type: types.ask_musics_set_fetching_submit,
  payload,
});

export const ask_musics_store_submit_result = (
  payload: types.ask_musics_store_submit_result_action["payload"]
): types.AskMusicsActionTypes => ({
  type: types.ask_musics_store_submit_result,
  payload,
});

export const ask_musics_clear_submit_result =
  (): types.AskMusicsActionTypes => ({
    type: types.ask_musics_clear_submit_result,
  });

export const $ask_musics_fetch_requests =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();

        dispatcher(
          actions.ask_musics.ask_musics_set_fetching_requests({ fetching: true })
        );

        const response = await di.AskMusicsRepository.fetch_user_requests({
          user_id: user.id,
        });

        dispatcher(
          actions.ask_musics.ask_musics_set_fetching_requests({ fetching: false })
        );

        if (response.error) {
          alert(response.message);
          return;
        }

        dispatcher(
          actions.ask_musics.ask_musics_store_requests({
            requests: response.data,
          })
        );
      })
    );
  };

export const $ask_musics_submit =
  (payload: { links: string }): ThunkAction<any, RootState, any, any> =>
  async (dispatcher, getState) => {
    dispatcher(
      actions.auth.$request_login_if_not_authenticated(async (user) => {
        const { di } = getState();
        const { valid_urls, invalid_lines } = parse_youtube_urls_from_text(
          payload.links
        );

        if (valid_urls.length === 0) {
          dispatcher(
            actions.ask_musics.ask_musics_store_submit_result({
              result: {
                submitted_urls: [],
                already_requested_urls: [],
                invalid_lines,
              },
            })
          );
          return;
        }

        dispatcher(
          actions.ask_musics.ask_musics_set_fetching_submit({ fetching: true })
        );

        const response = await di.AskMusicsRepository.submit_requests({
          user_id: user.id,
          urls: valid_urls,
        });

        dispatcher(
          actions.ask_musics.ask_musics_set_fetching_submit({ fetching: false })
        );

        if (response.error) {
          alert(response.message);
          return;
        }

        dispatcher(
          actions.ask_musics.ask_musics_store_submit_result({
            result: {
              ...response.data,
              invalid_lines: [
                ...response.data.invalid_lines,
                ...invalid_lines,
              ],
            },
          })
        );

        await dispatcher(actions.ask_musics.$ask_musics_fetch_requests());
      })
    );
  };

export const $ask_musics_open_modal =
  (): ThunkAction<any, RootState, any, any> => async (dispatcher) => {
    dispatcher(actions.ask_musics.ask_musics_clear_submit_result());
    dispatcher(actions.modals.$open({ key: MODAL_KEYS["ask-music"] }));
    await dispatcher(actions.ask_musics.$ask_musics_fetch_requests());
  };
