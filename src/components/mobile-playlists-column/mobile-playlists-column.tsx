import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/mobile-playlists-column.container";
import { PlaylistsList } from "../playlists-list/playlists-list";

import { useModal } from "@/hooks/use-modal";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["playlists-list-modal"]);

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
            </div>
            <PlaylistsList />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const MobilePlaylistsColumn = connector(Wrapper);
