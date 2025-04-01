import { PlayIcon } from "@heroicons/react/24/solid";
import React from "react";
import { connector, ContainerProps } from "./containers/tracks-list.container";
import clsx from "clsx";
import { EllipsisIcon, PauseIcon } from "lucide-react";
import { FormattedMessage } from "../formatted-message/formatted-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PlayingAnimationBars } from "../playing-animation-bars/playing-animation-bars";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <>
      {props.tracks.map((_, i) => {
        const is_current_track = props.current_track?.title_id === _.title_id;
        const is_playing = props.is_playing && is_current_track;

        return (
          <div
            key={`${_.title_id} + ${i}`}
            onClick={() => props.onPlay({ title_id: _.title_id })}
            className="cursor-pointer px-2 py-2 border-transparent group active:bg-zinc-800 hover:bg-zinc-800 border rounded"
          >
            <div className="relative w-full flex items-center">
              {props.show_cover ? (
                <div className="relative flex-shrink-0">
                  <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center">
                    {is_playing ? (
                      <PauseIcon className="h-5 w-5 text-zinc-50" />
                    ) : (
                      <PlayIcon className="h-5 w-5 text-zinc-50" />
                    )}
                  </div>
                  <img
                    style={{
                      backgroundImage: `url(/characters/characters-background.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    alt="Track artwork"
                    className="rounded h-12 w-12 object-cover"
                    src={_.playlist_cover}
                  />
                  {is_playing && <PlayingAnimationBars />}
                </div>
              ) : (
                <div className="px-4 w-10 h-[20px] relative">
                  {!is_playing && (
                    <div className="text-zinc-400 group-hover:opacity-0">
                      {i + 1}
                    </div>
                  )}
                  {is_playing && (
                    <div className="flex items-end group-hover:opacity-0">
                      <div className="playing-animation h-[20px]">
                        <div className="bar !bg-green-400"></div>
                        <div className="bar !bg-green-400"></div>
                        <div className="bar !bg-green-400"></div>
                      </div>
                    </div>
                  )}
                  <div className="absolute opacity-0 group-hover:opacity-100 inset-0 flex items-center justify-center">
                    {is_playing && (
                      <PauseIcon className="h-4 w-4 text-zinc-50" />
                    )}
                    {!is_playing && (
                      <PlayIcon className="h-4 w-4 text-zinc-50" />
                    )}
                  </div>
                </div>
              )}

              <div className="px-4">
                <div
                  className={clsx(
                    is_current_track ? "text-green-400" : "text-zinc-50"
                  )}
                >
                  {_.title}
                </div>
                <div className="text-sm text-zinc-500">{_.artist}</div>
              </div>

              <div className="absolute group right-0 flex items-center text-zinc-400">
                {props.show_duration && (
                  <div className="group-hover:hidden md:block hidden md:absolute mr-2 md:mr-0 right-2">
                    {Math.floor(_.duration / 60)}:
                    {(_.duration % 60).toString().padStart(2, "0")}
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="w-10 h-10 z-10 hover:text-zinc-50 hover:opacity-100 group-hover:opacity-100 data-[state=open]:bg-zinc-700 data-[state=open]:opacity-100 md:opacity-0 rounded-full hover:bg-zinc-700 flex items-center justify-center">
                    <EllipsisIcon className="h-4 w-4 " />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onAddToQueue(_.title_id, { play_next: true });
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/play-after" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onAddToQueue(_.title_id, { play_next: false });
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/add-to-queue" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onAddToPlaylist(_.title_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/add-to-playlist" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onShare(_.title_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/share" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDownloadTrack(_.title_id);
                      }}
                    >
                      <FormattedMessage id="tracks-dropdown/download" />
                    </DropdownMenuItem>

                    {props.can_be_removed_from_playlist && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          props.onRemoveTrackFromPlaylist({
                            title_id: _.title_id,
                            playlist_id: props.playlist?.playlist_id as string,
                          });
                        }}
                      >
                        <FormattedMessage id="tracks-dropdown/remove" />
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const TracksList = connector(Wrapper);
