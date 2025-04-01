import React from "react";
import { Track } from "@/types/track.type";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { PlayingAnimationBars } from "../playing-animation-bars/playing-animation-bars";

export const TrackInQueueItem: React.FC<
  Track & {
    onClick: () => void;
    current_track?: boolean;
    is_selected?: boolean;
    is_playing?: boolean;
  }
> = (props) => {
  return (
    <div
      onClick={props.onClick}
      className="flex items-center cursor-pointer group p-2 px-2 rounded hover:bg-zinc-800"
    >
      <div className="relative flex-shrink-0">
        <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center">
          {props.is_playing && props.is_selected ? (
            <PauseIcon className="h-5 w-5 text-zinc-50" />
          ) : (
            <PlayIcon className="h-5 w-5 text-zinc-50" />
          )}
        </div>
        <img
          alt="Track artwork"
          className="rounded h-12 w-12"
          src={props.playlist_cover}
        />
        {props.is_playing && props.is_selected && <PlayingAnimationBars />}
      </div>
      <div className="ml-3 ">
        <div
          className={clsx(
            "overflow-ellipsis",
            props.is_selected && "text-green-400",
            !props.is_selected && "text-zinc-100"
          )}
        >
          {props.title}
        </div>
        <div className="text-sm text-zinc-500">{props.playlist_name}</div>
      </div>
    </div>
  );
};
