import React from "react";
import { PauseIcon } from "lucide-react";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  connector,
  ContainerProps,
} from "./container/player-bar-mobile.container";

import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div onClick={props.onClick} className={clsx("w-full bg-zinc-900")}>
      <div className="flex items-center justify-between gap-4">
        <div className="pl-2 py-2">
          <div className="flex flex-1 items-center gap-3">
            <img
              alt="Now playing"
              className="rounded aspect-square w-12"
              src={props.current_track.playlist_cover}
            />
            <div>
              <div className="text-sm">{props.current_track.title}</div>
              <div className="text-sm text-zinc-500">
                {props.current_track.artist}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (props.is_playing) {
              props.onPause();
            } else {
              props.onPlay();
            }
          }}
          className="rounded-full p-4"
        >
          {props.is_playing ? (
            <PauseIcon className="h-4 w-4 fill-zinc-900" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <Slider.Root
        value={[props.current_time]}
        max={props.duration}
        step={1}
        className="relative flex w-full h-0.5 group touch-none select-none items-center bg-zinc-900"
      >
        <Slider.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-zinc-800">
          <Slider.Range className="absolute h-full rounded-full bg-zinc-50" />
        </Slider.Track>
      </Slider.Root>
    </div>
  );
};

export const PlayerBarMobile = connector(Wrapper);
