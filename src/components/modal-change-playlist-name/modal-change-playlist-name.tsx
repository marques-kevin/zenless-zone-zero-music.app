import React, { useEffect, useState } from "react";

import {
  connector,
  ContainerProps,
} from "./container/modal-change-playlist-name.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { Modal } from "../ui/modal";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen, value } = useModal(MODAL_KEYS["change-playlist-name"]);
  const [name, setName] = useState("");

  useEffect(() => {
    setName(
      props.playlists.find((playlist) => playlist.playlist_id === value)
        ?.playlist_name || ""
    );
  }, [value]);

  return (
    <Modal isOpen={isOpen} onClose={props.onClose}>
      <div className="mt-4">
        <div className="text-2xl font-medium">
          <FormattedMessage id="modal-change-playlist-name/title" />
        </div>
        <div className="text-zinc-400 mt-4">
          <FormattedMessage id="modal-change-playlist-name/description" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.onSave({
              playlist_id: value as string,
              playlist_name: name as string,
            });
          }}
        >
          <input
            type="search"
            required
            minLength={1}
            maxLength={50}
            className="w-full border-b-2 bg-zinc-900 rounded-t px-4 mt-4 border-zinc-700 bg-transparent py-2 text-zinc-50 placeholder:text-zinc-400 focus:outline-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <button
            type="submit"
            className="w-full bg-zinc-900 text-zinc-50 py-3 rounded-full mt-4 hover:bg-zinc-950"
          >
            <FormattedMessage id="modal-change-playlist-name/save" />
          </button>
        </form>
      </div>
    </Modal>
  );
};

export const ModalChangePlaylistName = connector(Wrapper);
