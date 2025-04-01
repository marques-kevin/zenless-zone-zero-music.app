import React from "react";

import { Drawer } from "vaul";

import { Loader2Icon } from "lucide-react";
import {
  connector,
  ContainerProps,
} from "./container/modal-playlist-create.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { resolve_playlist_cover } from "@/utils/resolve_playlist_cover";
import clsx from "clsx";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { useIntl } from "react-intl";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["create-playlist"]);
  const intl = useIntl();

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
                  <FormattedMessage id="modals/create-playlist/title" />
                </div>
                <div className="text-sm text-zinc-500">
                  <FormattedMessage id="modals/create-playlist/description" />
                </div>
              </div>
            </div>

            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();

                props.onSubmit({
                  name: e.currentTarget.playlist_name.value,
                });
              }}
            >
              <input
                autoFocus
                required
                type="text"
                name="playlist_name"
                className="w-full bg-zinc-700 rounded-full p-3 px-6 outline-none"
                placeholder={intl.formatMessage({
                  id: "modals/create-playlist/placeholder",
                })}
              />

              <div className="mt-2 ">
                <button
                  disabled={props.create_playlist_fetching}
                  type="submit"
                  className="w-full gap-2 bg-zinc-900 hover:bg-zinc-950 rounded-full p-3 px-6 outline-none"
                >
                  {props.create_playlist_fetching ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                  ) : (
                    <FormattedMessage id="modals/create-playlist/save" />
                  )}
                </button>
              </div>
            </form>

            {props.playlists.length > 0 && (
              <div className="mt-8 grid gap-2">
                <div className="text-sm text-zinc-400">
                  <FormattedMessage id="modals/create-playlist/your-other-playlists" />
                </div>

                {props.playlists.map((playlist) => (
                  <div key={playlist.playlist_id}>
                    <div className="flex relative items-center p-2 px-0 rounded">
                      <div className="relative flex-shrink-0">
                        <img
                          alt="Track artwork"
                          className="rounded bg-zinc-700 h-12 w-12 object-cover object-center"
                          src={resolve_playlist_cover(playlist.playlist_cover)}
                        />
                      </div>

                      <div className="ml-3 ">
                        <div className={clsx("overflow-ellipsis")}>
                          {playlist.playlist_name}
                        </div>
                        <div className="text-sm text-zinc-500">
                          <FormattedMessage id="playlist-details-pane/playlist-label" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const ModalPlaylistCreate = connector(Wrapper);
