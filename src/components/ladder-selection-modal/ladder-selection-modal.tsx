import React, { useEffect } from "react";

import {
  connector,
  ContainerProps,
} from "./container/ladder-selection-modal.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { Modal } from "@/components/ui/modal";
import { characters as ALL_CHARACTERS } from "@/database/characters";
import clsx from "clsx";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";

const NUMBER_OF_SELECTED_CHARACTERS = 5;

const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["ladder-selection"]);

  const [selected_characters, set_selected_characters] = React.useState<
    Array<string>
  >([]);

  const toggle_character = (name: string) => {
    set_selected_characters((current) => {
      const exists = current.includes(name);

      if (exists) {
        return current.filter((entry) => entry !== name);
      }

      if (current.length >= NUMBER_OF_SELECTED_CHARACTERS) {
        return current;
      }

      return [...current, name];
    });
  };

  const get_order_label = (name: string) => {
    const index = selected_characters.indexOf(name);

    if (index === -1) return null;

    return index + 1;
  };

  useEffect(() => {
    set_selected_characters(props.selection);
  }, [props.selection]);

  const can_save = selected_characters.length === NUMBER_OF_SELECTED_CHARACTERS;

  return (
    <Modal isOpen={isOpen} onClose={props.on_close}>
      <div className="mt-4">
        <div className="text-2xl font-medium">
          <FormattedMessage id="ladder/selection/title" />
        </div>
        <div className="text-zinc-400 mt-3 text-sm">
          <FormattedMessage
            id="ladder/selection/description"
            values={{
              first: <span className="font-semibold text-zinc-100">first</span>,
              favorite: (
                <span className="font-semibold text-zinc-100">#1 favorite</span>
              ),
              unselect: (
                <span className="font-semibold text-zinc-100">unselect</span>
              ),
            }}
          />
        </div>

        <button
          type="button"
          disabled={!can_save}
          className={clsx(
            "w-full py-3 rounded-full mt-4 text-sm font-semibold transition-colors",
            can_save
              ? "bg-zinc-900 text-zinc-50 hover:bg-zinc-950"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          )}
          onClick={() => {
            if (!can_save) return;
            props.on_save(selected_characters);
          }}
        >
          <FormattedMessage id="ladder/selection/save" />
        </button>

        <div className="mt-6 text-zinc-500 grid grid-cols-3 md:grid-cols-4 gap-4">
          {ALL_CHARACTERS.map((character) => {
            const order = get_order_label(character.name);
            const is_selected = order !== null;

            return (
              <button
                key={character.name}
                type="button"
                onClick={() => toggle_character(character.name)}
                className={clsx(
                  "group bg-zinc-900 transition-all duration-150 rounded overflow-hidden border-2",
                  is_selected
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-zinc-900 hover:border-indigo-500 hover:bg-indigo-500/10"
                )}
              >
                <div
                  style={{
                    backgroundImage: `url(/characters/characters-background.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  className="relative"
                >
                  <img
                    className="w-full object-cover aspect-square"
                    src={character.image}
                    alt={character.name}
                  />

                  {is_selected && (
                    <div className="absolute top-1 left-1 rounded-full bg-indigo-500 text-zinc-950 text-[11px] font-semibold px-2 py-0.5 shadow-sm">
                      #{order}
                    </div>
                  )}
                </div>
                <div className="text-xs capitalize py-1 text-zinc-50 text-center ">
                  {character.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export const LadderSelectionModal = connector(Wrapper);
