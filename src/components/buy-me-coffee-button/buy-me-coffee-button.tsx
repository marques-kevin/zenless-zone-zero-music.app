import React from "react";
import {
  connector,
  ContainerProps,
} from "./container/buy-me-coffee-button.container";
import { ExternalLinkIcon, SparklesIcon } from "lucide-react";
import { tinycardoUrl } from "@/constants/config";
import { Modal, ModalDescription, ModalTitle } from "../ui/modal";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/use-modal";
import { MODAL_KEYS } from "@/constants/modal-keys";
import ReactMarkdown from "react-markdown";
import { useIntl } from "react-intl";

const Wrapper: React.FC<ContainerProps> = (props) => {
  const { formatMessage } = useIntl();
  const { isOpen } = useModal(MODAL_KEYS["buy-me-coffee"]);

  return (
    <>
      <button
        onClick={props.onOpen}
        className="relative text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
      >
        <SparklesIcon className="w-5 h-5" />
      </button>

      <Modal isOpen={isOpen} onClose={props.onClose}>
        <ModalTitle>
          {formatMessage({ id: "buy-me-coffee-button/title" })}
        </ModalTitle>
        <ModalDescription>
          <ReactMarkdown>
            {formatMessage({
              id: "buy-me-coffee-button/description",
            })}
          </ReactMarkdown>
        </ModalDescription>
        <div className="mt-4">
          <a
            href={tinycardoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={props.onClickLink}
          >
            <Button>
              <ExternalLinkIcon className="w-5 h-5" />{" "}
              {formatMessage({ id: "buy-me-coffee-button/buy-me-a-coffee" })}
            </Button>
          </a>
        </div>
      </Modal>
    </>
  );
};

export const BuyMeCoffeeButton = connector(Wrapper);
