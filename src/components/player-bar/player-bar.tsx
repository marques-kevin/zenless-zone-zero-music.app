import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  HeartIcon,
  Loader2,
  Maximize2,
  Minimize2,
  PauseIcon,
  Repeat1Icon,
  RepeatIcon,
  Share2Icon,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { PlayIcon } from "@heroicons/react/24/solid";
import { connector, ContainerProps } from "./container/player-bar.container";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { formatTime } from "@/lib/utils";
import { PlayingAnimationBars } from "../playing-animation-bars/playing-animation-bars";
import clsx from "clsx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipPortal,
} from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { FormattedMessage } from "react-intl";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const handleSliderChange = (value: number[]) => {
    props.onSliderTimeUpdate(value[0]);
  };

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div className="p-4 hidden md:block">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative">
            <img
              alt="Now playing"
              className="rounded"
              height={56}
              src={props.current_track.playlist_cover}
              width={56}
            />
            {props.is_playing && <PlayingAnimationBars />}
          </div>
          <div>
            <div className="">{props.current_track.title}</div>
            <div className="text-sm text-zinc-500">
              {props.current_track.artist}
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button
                    onClick={() =>
                      props.onToggleLike({
                        title_id: props.current_track.title_id,
                      })
                    }
                    size="icon"
                    variant="ghost"
                    className={clsx(
                      "text-zinc-50 hover:bg-[#1A1A1A] hover:text-red-400 hover:fill-red-400",
                      props.is_liked && "text-red-400 fill-red-400"
                    )}
                  >
                    <HeartIcon
                      className={clsx(
                        "h-4 w-4",
                        props.is_liked && "fill-red-400"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="z-50 bg-zinc-800 text-xs border-none mb-1 px-4 py-2 rounded animate-in fade-in-0 zoom-in-95  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                  <FormattedMessage
                    id="player-bar/like/tooltip"
                    values={{ number_of_likes: props.number_of_likes }}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={props.onToggleRandomTracks}
              size="icon"
              variant="ghost"
              className={clsx(
                "text-zinc-50 hover:bg-[#1A1A1A]",
                props.is_random_tracks_enabled && "text-green-400"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              onClick={props.onPrevious}
              size="icon"
              variant="ghost"
              className=" hover:bg-[#1A1A1A]"
            >
              <SkipBack className="h-4 w-4 text-zinc-50 fill-zinc-50" />
            </Button>
            <Button
              size="icon"
              className="rounded-full"
              onClick={() => {
                if (props.is_loading) return;
                if (props.is_playing) {
                  props.onPause();
                } else {
                  props.onPlay();
                }
              }}
            >
              {props.is_loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : props.is_playing ? (
                <PauseIcon className="h-4 w-4 fill-zinc-900" />
              ) : (
                <PlayIcon className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={props.onNext}
              size="icon"
              variant="ghost"
              className=" hover:bg-[#1A1A1A]"
            >
              <SkipForward className="h-4 w-4 text-zinc-50 fill-zinc-50" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={props.onReplayMode}
              className="text-zinc-50 hover:bg-[#1A1A1A]"
            >
              {props.replay_mode === "replay_playlist" && (
                <RepeatIcon className="h-4 w-4" />
              )}
              {props.replay_mode === "replay_track" && (
                <Repeat1Icon className="h-4 w-4 text-green-400" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                props.onShare({ title_id: props.current_track.title_id })
              }
              className="text-zinc-50 hover:bg-[#1A1A1A]"
            >
              <Share2Icon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="text-xs text-zinc-400">
              {formatTime(props.current_time)}
            </div>
            <Slider
              className="[&_[role=slider]]:bg-zinc-50"
              value={[props.current_time]}
              max={props.duration}
              step={1}
              defaultValue={[0]}
              onValueChange={handleSliderChange}
            />
            <div className="text-xs text-zinc-400">
              {formatTime(props.duration)}
            </div>
          </div>
        </div>

        <div className="flex flex-1 justify-end">
          <div className="flex items-center">
            <div className="px-2 flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={props.onToggleMute}
                className="text-zinc-50 hover:bg-[#1A1A1A]"
              >
                {props.is_muted ? (
                  <VolumeXIcon className="h-4 w-4" />
                ) : (
                  <Volume2Icon className="h-4 w-4" />
                )}
              </Button>

              <Slider
                className="w-[100px] [&_[role=slider]]:bg-zinc-50"
                defaultValue={[100]}
                max={100}
                step={1}
                value={[props.volume]}
                onValueChange={(value) => {
                  props.onVolumeChange(value[0]);
                }}
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              className="text-zinc-50 hover:bg-[#1A1A1A]"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PlayerBar = connector(Wrapper);
