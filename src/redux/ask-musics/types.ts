import { AskMusic } from "@/types/ask-music.type";
import { SubmitAskMusicResult } from "@/interfaces/IAskMusicsRepository";

export const ask_musics_store_requests = "ask_musics_store_requests";
export const ask_musics_set_fetching_requests = "ask_musics_set_fetching_requests";
export const ask_musics_set_fetching_submit = "ask_musics_set_fetching_submit";
export const ask_musics_store_submit_result = "ask_musics_store_submit_result";
export const ask_musics_clear_submit_result = "ask_musics_clear_submit_result";

export type ask_musics_store_requests_action = {
  type: typeof ask_musics_store_requests;
  payload: {
    requests: AskMusic[];
  };
};

export type ask_musics_set_fetching_requests_action = {
  type: typeof ask_musics_set_fetching_requests;
  payload: {
    fetching: boolean;
  };
};

export type ask_musics_set_fetching_submit_action = {
  type: typeof ask_musics_set_fetching_submit;
  payload: {
    fetching: boolean;
  };
};

export type ask_musics_store_submit_result_action = {
  type: typeof ask_musics_store_submit_result;
  payload: {
    result: SubmitAskMusicResult;
  };
};

export type ask_musics_clear_submit_result_action = {
  type: typeof ask_musics_clear_submit_result;
};

export type AskMusicsActionTypes =
  | ask_musics_store_requests_action
  | ask_musics_set_fetching_requests_action
  | ask_musics_set_fetching_submit_action
  | ask_musics_store_submit_result_action
  | ask_musics_clear_submit_result_action;
