import React, { useEffect } from "react";

import { connector, ContainerProps } from "./container/news-button.container";
import { BellIcon } from "lucide-react";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const should_show_new_news_icon =
    !props.last_time_news_was_seen ||
    props.last_time_news_was_seen < props.current_news_date;

  useEffect(() => {
    props.onMount();
  }, []);

  return (
    <button
      onClick={props.onClick}
      className="relative outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700"
    >
      {should_show_new_news_icon && (
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      )}
      <BellIcon className="h-5 w-5" />
    </button>
  );
};

export const NewsButton = connector(Wrapper);
