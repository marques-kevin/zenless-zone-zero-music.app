export const news_set_last_time_news_was_seen =
  "news_set_last_time_news_was_seen";
export interface news_set_last_time_news_was_seen_action {
  type: typeof news_set_last_time_news_was_seen;
  payload: {
    last_time_news_was_seen: Date | null;
  };
}

export type NewsActionTypes = news_set_last_time_news_was_seen_action;
