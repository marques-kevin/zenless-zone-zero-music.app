import * as types from "./types";
import { AskMusic } from "@/types/ask-music.type";
import { SubmitAskMusicResult } from "@/interfaces/IAskMusicsRepository";

interface State {
  requests: AskMusic[];
  requests_fetching: boolean;
  submit_fetching: boolean;
  submit_result: SubmitAskMusicResult | null;
}

const initialState: State = {
  requests: [],
  requests_fetching: false,
  submit_fetching: false,
  submit_result: null,
};

export function askMusicsReducer(
  state = initialState,
  action: types.AskMusicsActionTypes
): State {
  if (action.type === types.ask_musics_store_requests) {
    return {
      ...state,
      requests: action.payload.requests,
    };
  }

  if (action.type === types.ask_musics_set_fetching_requests) {
    return {
      ...state,
      requests_fetching: action.payload.fetching,
    };
  }

  if (action.type === types.ask_musics_set_fetching_submit) {
    return {
      ...state,
      submit_fetching: action.payload.fetching,
    };
  }

  if (action.type === types.ask_musics_store_submit_result) {
    return {
      ...state,
      submit_result: action.payload.result,
    };
  }

  if (action.type === types.ask_musics_clear_submit_result) {
    return {
      ...state,
      submit_result: null,
    };
  }

  return state;
}
