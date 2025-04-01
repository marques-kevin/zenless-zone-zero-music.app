import React from "react";

import { Drawer } from "vaul";

import {
  connector,
  ContainerProps,
} from "./container/modal-request-login.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { Modal } from "../ui/modal";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["request-login"]);

  return (
    <Modal isOpen={isOpen} onClose={props.onClose}>
      <div className="mt-4">
        <div className="text-2xl font-medium">
          <FormattedMessage id="modal-request-login/title" />
        </div>
        <div className="text-zinc-400 mt-4">
          <FormattedMessage id="modal-request-login/description" />
        </div>
        <div className="mt-8 text-zinc-500">
          <button
            onClick={() => {
              props.onLogin();
            }}
            className="bg-zinc-900 w-full hover:bg-zinc-950 text-zinc-50 px-4 py-3 rounded-full"
          >
            <FormattedMessage id="modal-request-login/login" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const ModalRequestLogin = connector(Wrapper);
