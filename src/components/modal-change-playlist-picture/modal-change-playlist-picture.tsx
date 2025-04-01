import React from "react";

import {
  connector,
  ContainerProps,
} from "./container/modal-change-playlist-picture.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { Modal } from "../ui/modal";
import { characters } from "@/database/characters";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen, value } = useModal(MODAL_KEYS["change-playlist-picture"]);

  return (
    <Modal isOpen={isOpen} onClose={props.onClose}>
      <div className="mt-4">
        <div className="text-2xl font-medium">
          <FormattedMessage id="modal-change-playlist-picture/title" />
        </div>
        <div className="text-zinc-400 mt-4">
          <FormattedMessage id="modal-change-playlist-picture/description" />
        </div>
        <div className="mt-4 text-zinc-500 grid grid-cols-3 md:grid-cols-4 gap-4">
          {characters.map((character) => (
            <button
              key={character.name}
              className="border-2 group bg-zinc-900 hover:scale-110 hover:border-indigo-500 hover:bg-indigo-500 transition-all duration-200 border-zinc-900 rounded overflow-hidden"
            >
              <div
                style={{
                  backgroundImage: `url(/characters/characters-background.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() =>
                  props.onSelect({
                    playlist_id: value as string,
                    character: character.name,
                  })
                }
              >
                <img
                  className="w-full object-cover aspect-square"
                  src={character.image}
                  alt={character.name}
                />
              </div>
              <div className="text-xs capitalize py-1 text-zinc-50 text-center ">
                {character.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export const ModalChangePlaylistPicture = connector(Wrapper);
