import React from "react";
import { Button } from "@/components/ui/button";
import { SliderMobile } from "@/components/ui/slider";
import { Drawer } from "vaul";
import { useLocation, navigate } from "@reach/router";
import { useMediaQuery } from "react-responsive";

import {
  ChevronDownIcon,
  EllipsisIcon,
  HeartIcon,
  Loader2Icon,
  PauseIcon,
  Repeat1Icon,
  RepeatIcon,
  Shuffle,
  SkipBack,
  SkipForward,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  connector,
  ContainerProps,
} from "./container/player-mobile-full-screen.container";
import { formatTime } from "@/lib/utils";
import clsx from "clsx";
import { TracksList } from "../tracks-list/tracks-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ActionButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx("text-zinc-50 p-2 rounded-full")}
    >
      {props.children}
    </button>
  );
};

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const location = useLocation();
  const isOpen = location.href?.includes("player");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (!isMobile) {
    return null;
  }

  return (
    <Drawer.Root open={isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zinc-900/90 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex h-[100dvh] flex-col bg-zinc-900 text-zinc-50 md:hidden">
          <VisuallyHidden>
            <Drawer.Title>Modal</Drawer.Title>
            <Drawer.Description>Modal</Drawer.Description>
          </VisuallyHidden>
          <div className="flex-1 overflow-auto pt-4">
            <div className="relative">
              <div className="mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />
              <div className="absolute top-0 right-4 bottom-0 flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-10 h-10 z-10 hover:text-zinc-50 hover:opacity-100 group-hover:opacity-100 data-[state=open]:bg-zinc-700 data-[state=open]:opacity-100 md:opacity-0 rounded-full hover:bg-zinc-700 flex items-center justify-center">
                    <EllipsisIcon className="h-5 w-5 " />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onAddToPlaylist(props.current_track.title_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/add-to-playlist" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onShare(props.current_track.title_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/share" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="px-6">
              <div className="relative">
                <img
                  alt="Now playing"
                  style={{
                    backgroundImage: `url(/characters/characters-background.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  src={props.current_track.playlist_cover}
                  className="aspect-square w-full object-cover rounded-lg"
                />

                {props.is_loading && (
                  <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
                    <Loader2Icon className="h-8 w-8 animate-spin" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-2xl font-medium">
                  {props.current_track.title}
                </div>
                <div className="text-sm text-zinc-500">
                  {props.current_track.artist}
                </div>
              </div>
            </div>

            <div className="ml-4 mt-4">
              <button
                className="flex items-center justify-center px-3 p-2 rounded-full bg-zinc-800"
                onClick={() => props.onToggleLike(props.current_track.title_id)}
              >
                <div className="flex items-center justify-center space-x-2">
                  <HeartIcon
                    className={clsx(
                      "h-4 w-4",
                      props.is_liked && "fill-red-400 text-red-400"
                    )}
                  />

                  <div className="text-xs">
                    {props.current_track_number_of_likes}
                  </div>
                </div>
              </button>
            </div>

            <div className="flex flex-1 flex-col mt-4 items-center gap-2 px-6">
              <div className="flex w-full items-center gap-2">
                <SliderMobile
                  className="[&_[role=slider]]:bg-zinc-50"
                  value={[props.current_time]}
                  max={props.duration}
                  step={1}
                  onValueChange={(value) => props.onSliderTimeUpdate(value[0])}
                />
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="text-xs text-zinc-400">
                  {formatTime(props.current_time)}
                </div>
                <div className="text-xs text-zinc-400">
                  {formatTime(props.duration)}
                </div>
              </div>
            </div>

            <div className="flex mt-4 justify-center items-center gap-4">
              <ActionButton onClick={props.onToggleRandomTracks}>
                <Shuffle
                  className={clsx(
                    "h-5 w-5",
                    props.is_random_tracks_enabled && "text-green-400"
                  )}
                />
              </ActionButton>
              <ActionButton onClick={props.onPrevious}>
                <SkipBack className="h-5 w-5 fill-zinc-50" />
              </ActionButton>
              <button
                className="rounded-full bg-white h-14 w-14 flex items-center justify-center"
                onClick={() => {
                  if (props.is_loading) {
                    return;
                  }

                  if (props.is_playing) {
                    props.onPause();
                  } else {
                    props.onPlay();
                  }
                }}
              >
                {props.is_playing ? (
                  <PauseIcon className="h-6 w-6 fill-zinc-900 text-zinc-900" />
                ) : (
                  <PlayIcon className="h-6 w-6 fill-zinc-900" />
                )}
              </button>
              <ActionButton onClick={props.onNext}>
                <SkipForward className="h-5 w-5 text-zinc-50 fill-zinc-50" />
              </ActionButton>
              <ActionButton onClick={props.onReplayMode}>
                {props.replay_mode === "replay_playlist" && (
                  <RepeatIcon className="h-5 w-5" />
                )}
                {props.replay_mode === "replay_track" && (
                  <Repeat1Icon className="h-5 w-5 text-green-400" />
                )}
              </ActionButton>
            </div>

            <div className="border-t border-zinc-800 mt-8 pt-2 px-2">
              <TracksList
                tracks={props.tracks_currently_playing}
                show_duration={false}
                show_cover
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const PlayerMobileFullScreen = connector(Wrapper);
