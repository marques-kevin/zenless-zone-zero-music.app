import { PlayIcon } from "@heroicons/react/24/solid";
import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/playlist-details-pane-mobile.container";
import clsx from "clsx";
import { ChevronDown, EllipsisIcon, PauseIcon, PlusIcon } from "lucide-react";
import { uniqBy } from "lodash";
import { Drawer } from "vaul";
import { useLocation } from "@reach/router";
import { useMediaQuery } from "react-responsive";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { resolve_playlist_cover } from "@/utils/resolve_playlist_cover";
import { all_playlists, official_playlists } from "@/database/playlists";
import { TracksList } from "../tracks-list/tracks-list";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <Drawer.Root open={props.isOpen} onOpenChange={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content
          className={clsx(
            "rounded-t-[10px] md:rounded-none bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 md:absolute inset-0"
          )}
        >
          <div className="overflow-auto">
            <div className="mx-auto mb-8 h-1.5 w-40 mt-4 flex-shrink-0 rounded-full bg-zinc-700" />
            {props.children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const tracks_in_album = props.playlist?.tracks;
  const { isOpen, value: custom_playlist_id } = useModal(
    MODAL_KEYS["playlist-details"]
  );

  const is_official_playlist =
    official_playlists.findIndex(
      (playlist) => playlist.playlist_id === props.playlist?.playlist_id
    ) !== -1;

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (!isMobile) {
    return null;
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content
          className={clsx(
            "rounded-t-[10px] z-50 md:rounded-none bg-zinc-900 flex flex-col fixed bottom-0 left-0 right-0 md:absolute inset-0"
          )}
        >
          <VisuallyHidden>
            <Drawer.Title>Modal</Drawer.Title>
            <Drawer.Description>Modal</Drawer.Description>
          </VisuallyHidden>
          <div className="overflow-auto">
            <div className="mx-auto mb-8 h-1.5 w-40 mt-4 flex-shrink-0 rounded-full bg-zinc-700" />
            <div className="absolute items-center justify-end gap-2 flex top-4 right-4">
              <button
                onClick={() => props.onClose()}
                className="hidden md:flex items-center justify-end p-2 hover:bg-zinc-700 text-zinc-50 rounded-full"
              >
                <ChevronDown className="h-6 w-6 text-zinc-400" />
              </button>

              {!is_official_playlist && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-zinc-700 text-zinc-50 rounded-full">
                    <EllipsisIcon className="h-6 w-6 text-zinc-400" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        props.onOpenChangePlaylistName(
                          props.playlist?.playlist_id as string
                        )
                      }
                    >
                      <FormattedMessage id="playlists-dropdown/change-name" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        props.onOpenChangePlaylistPicture(
                          props.playlist?.playlist_id as string
                        )
                      }
                    >
                      <FormattedMessage id="playlists-dropdown/change-picture" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() =>
                        props.onRemovePlaylist(
                          props.playlist?.playlist_id as string
                        )
                      }
                    >
                      <FormattedMessage id="playlist-details-pane/delete" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="md:flex items-center gap-4 md:p-4 px-6">
              <div className="relative">
                <img
                  style={{
                    backgroundImage: `url(/characters/characters-background.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  alt="Album cover"
                  className="aspect-square mx-auto rounded-md md:mx-0 w-full md:w-[200px] object-cover relative z-10"
                  src={resolve_playlist_cover(props.playlist?.playlist_cover)}
                  loading="lazy"
                  decoding="async"
                />
                <button
                  onClick={() =>
                    props.playlist &&
                    props.onPlayAlbum(props.playlist.playlist_id)
                  }
                  className="p-4 shadow-md absolute bottom-4 right-4 hover:bg-green-400 rounded-full hover:scale-110 transition-all duration-300 bg-green-500 z-20"
                >
                  <PlayIcon className="h-5 w-5 text-zinc-900" />
                </button>
              </div>

              <div className="flex flex-col text-left">
                <p className="text-sm mt-2 md:mt-0 text-zinc-400">
                  <FormattedMessage id="playlist-details-pane/playlist-label" />
                </p>
                <div className="font-bold md:my-2 text-2xl md:text-4xl text-zinc-50">
                  {props.playlist?.playlist_name}
                </div>
                <p className="text-sm text-zinc-400">
                  {uniqBy(tracks_in_album, "artist")
                    .map((track) => track.artist)
                    .join(", ")}
                </p>
                <div className="flex justify-between md:justify-start mt-4 mb-4 gap-2">
                  <span className="mt-2 md:mt-0 text-zinc-400">
                    <FormattedMessage
                      id="playlist-details-pane/tracks-count"
                      values={{ c: tracks_in_album?.length }}
                    />
                  </span>
                  <span className="mt-2 md:mt-0 text-zinc-400">
                    <FormattedMessage
                      id="playlist-details-pane/duration"
                      values={{
                        d: Math.floor(
                          (tracks_in_album?.reduce(
                            (acc, t) => acc + t.duration,
                            0
                          ) || 0) / 60
                        ),
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="grid pb-4 md:px-4 md:overflow-auto">
              <TracksList
                play_all_on_click
                custom_playlist_id={
                  is_official_playlist ? null : custom_playlist_id
                }
                tracks={tracks_in_album || []}
                can_be_removed_from_playlist={!is_official_playlist}
                playlist={props.playlist}
                show_duration={true}
              />
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const PlaylistDetailsPaneMobile = connector(Wrapper);
