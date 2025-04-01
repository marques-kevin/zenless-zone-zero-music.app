import * as types from "./types";

interface State {
  last_time_news_was_seen: Date | null;
  current_news_date: Date;
}

const initialState: State = {
  last_time_news_was_seen: null,
  current_news_date: new Date("2025-02-08"),
};

export function newsReducer(
  state = initialState,
  action: types.NewsActionTypes
): State {
  if (action.type === types.news_set_last_time_news_was_seen) {
    return {
      ...state,
      last_time_news_was_seen: action.payload.last_time_news_was_seen,
    };
  }

  return state;
}
