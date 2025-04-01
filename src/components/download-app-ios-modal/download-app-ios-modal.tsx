import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/download-app-ios-modal.container";
import { Modal, ModalDescription, ModalTitle } from "@/components/ui/modal";
import { useModal } from "@/hooks/use-modal";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";

const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["download-app-ios"]);

  return (
    <Modal isOpen={isOpen} onClose={props.onClose}>
      <ModalTitle>
        <FormattedMessage id="download-app-ios-modal/title" />
      </ModalTitle>
      <ModalDescription>
        <FormattedMessage id="download-app-ios-modal/description" />
        clicks.
      </ModalDescription>

      {isOpen && (
        <video
          src="/other/how-to-install-ios.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="mt-4 rounded-b-[48px] rounded-t-lg"
        />
      )}
    </Modal>
  );
};

export const DownloadAppIosModal = connector(Wrapper);
