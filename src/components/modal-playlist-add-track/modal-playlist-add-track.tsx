import React from "react";
import { Drawer } from "vaul";

import { Loader2Icon } from "lucide-react";
import {
  connector,
  ContainerProps,
} from "./container/modal-playlist-add-track.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { resolve_playlist_cover } from "@/utils/resolve_playlist_cover";
import clsx from "clsx";
import { tracks } from "@/database/tracks";
import { Track } from "@/types/track.type";
import { FormattedMessage } from "../formatted-message/formatted-message";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen, value } = useModal(MODAL_KEYS["add-to-playlist"]);
  const track = tracks.find((t) => t.title_id === value);

  return (
    <Drawer.Root open={isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zinc-900/90 z-50" />
        <Drawer.Content className="fixed max-w-md shadow-xl bottom-0 pt-8 left-0 right-0 z-50 flex mx-auto h-[100dvh]  flex-col text-zinc-50">
          <div className="flex-1 px-8 overflow-auto pt-4 rounded-lg bg-zinc-800">
            <div className="mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />
            <div className="">
              <div className="mt-4">
                <div className="text-2xl font-medium">
                  <FormattedMessage id="modals/add-to-playlist/title" />
                </div>
                <div className="text-sm text-zinc-500">
                  <FormattedMessage
                    id="modals/add-to-playlist/description"
                    values={{
                      t: (
                        <span className="font-semibold text-green-500">
                          {track?.title}
                        </span>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            {props.playlists.length === 0 && (
              <div className="mt-8">
                <div>
                  <FormattedMessage id="modals/add-to-playlist/no-playlists" />
                </div>
                <div className="text-sm text-zinc-400">
                  <FormattedMessage id="modals/add-to-playlist/no-playlists-description" />
                </div>
                <button
                  onClick={() => props.onCreatePlaylist()}
                  className="bg-zinc-900 rounded-md px-4 mt-4 py-2 w-full"
                >
                  <FormattedMessage id="modals/add-to-playlist/create-playlist" />
                </button>
              </div>
            )}

            {props.playlists.length > 0 && (
              <>
                <div className="mt-4 grid gap-2">
                  {props.playlists.map((playlist) => (
                    <div
                      key={playlist.playlist_id}
                      onClick={() =>
                        props.onSelect(playlist.playlist_id, track as Track)
                      }
                    >
                      <div className="flex relative items-center cursor-pointer p-2 px-2 rounded hover:bg-zinc-700">
                        <div className="relative flex-shrink-0">
                          <img
                            alt="Track artwork"
                            className="rounded bg-zinc-700 h-12 w-12 object-cover object-center"
                            src={resolve_playlist_cover(
                              playlist.playlist_cover
                            )}
                          />
                        </div>

                        <div className="ml-3 ">
                          <div className={clsx("overflow-ellipsis")}>
                            {playlist.playlist_name}
                          </div>
                          <div className="text-sm text-zinc-500">Playlist</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="">
                  <button
                    onClick={() => props.onCreatePlaylist()}
                    className="bg-zinc-900 rounded-full px-6 mt-4 py-3 w-full"
                  >
                    <FormattedMessage id="modals/add-to-playlist/create-playlist" />
                  </button>
                </div>
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const ModalPlaylistAddTrack = connector(Wrapper);
