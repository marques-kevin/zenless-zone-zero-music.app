import React from "react";

import { Drawer } from "vaul";

import { connector, ContainerProps } from "./container/modal-news.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { useIntl } from "react-intl";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["news"]);
  const intl = useIntl();

  return (
    <Drawer.Root open={isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zinc-900/90 z-50" />
        <Drawer.Content className="fixed outline-none max-w-lg shadow-xl bottom-0 pt-8 left-0 right-0 z-50 flex mx-auto h-[100dvh] flex-col text-zinc-50">
          <div className="flex-1 px-8 overflow-auto pt-4 pb-8 rounded-lg bg-zinc-800">
            <div className="mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />
            <div className="">
              <div className="mt-4">
                <div className="text-2xl font-medium">
                  <FormattedMessage id="modals/news/title" />
                </div>
                <div className="text-zinc-400 mt-4">
                  <FormattedMessage
                    id="modals/news/description"
                    values={{
                      linebreak: <br />,
                    }}
                  />
                </div>
                <div className="mt-8 text-sm text-zinc-500">
                  {new Intl.DateTimeFormat(intl.locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(props.current_news_date)}
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const ModalNews = connector(Wrapper);
