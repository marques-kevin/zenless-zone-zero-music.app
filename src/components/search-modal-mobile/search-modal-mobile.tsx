import { Drawer } from "vaul";
import { useLocation } from "@reach/router";
import React from "react";
import { tracks } from "../../database/tracks";
import { TrackInQueueItem } from "../track-in-queue-item/track-in-queue-item";
import {
  connector,
  ContainerProps,
} from "./container/search-modal-mobile.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useIntl } from "react-intl";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { uniqBy } from "lodash";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const location = useLocation();

  const isOpen = location.href?.includes(MODAL_KEYS.search);
  const intl = useIntl();

  return (
    <Drawer.Root open={isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zink-950" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 flex h-full flex-col rounded-md bg-zinc-900 z-50">
          <VisuallyHidden>
            <Drawer.Title>Modal</Drawer.Title>
            <Drawer.Description>Modal</Drawer.Description>
          </VisuallyHidden>
          <div className="flex-1 rounded-t-[10px] overflow-auto p-4">
            <div className="relative max-w-md mx-auto mb-8">
              <div className="mx-auto  h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />
            </div>
            <div className="mx-auto max-w-md">
              <input
                type="search"
                placeholder={intl.formatMessage({
                  id: "navbar/search/placeholder",
                })}
                className="w-full border-b border-zinc-800 bg-transparent px-4 py-2 text-zinc-50 placeholder:text-zinc-400 focus:outline-none"
                value={props.query}
                onChange={(e) => {
                  props.onChangeQuery(e.target.value);
                }}
              />
            </div>
            <div className="gap-2 mx-auto max-w-md flex-col mt-4">
              {uniqBy(
                tracks.filter((track) =>
                  track.title.toLowerCase().includes(props.query.toLowerCase())
                ),
                "title_id"
              ).map((track) => (
                <TrackInQueueItem
                  key={track.title_id}
                  onClick={() => props.onPlayTrack(track.title_id)}
                  {...track}
                  current_track={false}
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const SearchModalMobile = connector(Wrapper);
