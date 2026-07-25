import React from "react";
import { Drawer } from "vaul";
import { Loader2Icon } from "lucide-react";
import clsx from "clsx";
import { useIntl } from "react-intl";

import {
  connector,
  ContainerProps,
} from "./container/modal-ask-music.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { AskMusicStatus } from "@/types/ask-music.type";

const status_classnames: Record<AskMusicStatus, string> = {
  pending: "text-yellow-400",
  added: "text-green-400",
  cancelled: "text-red-400",
};

const RequestStatus: React.FC<{ status: AskMusicStatus }> = ({ status }) => {
  if (status === "pending") {
    return <FormattedMessage id="modals/ask-music/status/pending" />;
  }

  if (status === "added") {
    return <FormattedMessage id="modals/ask-music/status/added" />;
  }

  return <FormattedMessage id="modals/ask-music/status/cancelled" />;
};

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const { isOpen } = useModal(MODAL_KEYS["ask-music"]);
  const intl = useIntl();

  return (
    <Drawer.Root open={isOpen} onClose={props.onClose}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-zinc-900/90 z-50" />
        <Drawer.Content className="fixed max-w-md shadow-xl bottom-0 pt-8 left-0 right-0 z-50 flex mx-auto h-[100dvh] flex-col text-zinc-50">
          <div className="flex-1 px-8 overflow-auto pt-4 rounded-lg bg-zinc-800">
            <div className="mx-auto mb-8 h-1.5 w-40 flex-shrink-0 rounded-full bg-zinc-700" />

            <div className="mt-4">
              <div className="text-2xl font-medium">
                <FormattedMessage id="modals/ask-music/title" />
              </div>
              <div className="text-sm text-zinc-500">
                <FormattedMessage id="modals/ask-music/description" />
              </div>
            </div>

            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                props.onSubmit({
                  links: e.currentTarget.youtube_links.value,
                });
              }}
            >
              <textarea
                autoFocus
                required
                name="youtube_links"
                rows={6}
                className="w-full bg-zinc-700 rounded-2xl p-4 outline-none resize-none"
                placeholder={intl.formatMessage({
                  id: "modals/ask-music/placeholder",
                })}
              />

              {props.submit_result && (
                <div className="mt-3 text-sm text-zinc-400 space-y-1">
                  {props.submit_result.submitted_urls.length > 0 && (
                    <p>
                      <FormattedMessage
                        id="modals/ask-music/result/submitted"
                        values={{
                          count: props.submit_result.submitted_urls.length,
                        }}
                      />
                    </p>
                  )}
                  {props.submit_result.already_requested_urls.length > 0 && (
                    <p>
                      <FormattedMessage
                        id="modals/ask-music/result/already-requested"
                        values={{
                          count:
                            props.submit_result.already_requested_urls.length,
                        }}
                      />
                    </p>
                  )}
                  {props.submit_result.invalid_lines.length > 0 && (
                    <p className="text-red-400">
                      <FormattedMessage
                        id="modals/ask-music/result/invalid"
                        values={{
                          count: props.submit_result.invalid_lines.length,
                        }}
                      />
                    </p>
                  )}
                  {props.submit_result.submitted_urls.length === 0 &&
                    props.submit_result.already_requested_urls.length === 0 &&
                    props.submit_result.invalid_lines.length > 0 && (
                      <p className="text-red-400">
                        <FormattedMessage id="modals/ask-music/result/no-valid-links" />
                      </p>
                    )}
                </div>
              )}

              <div className="mt-4">
                <button
                  disabled={props.submit_fetching}
                  type="submit"
                  className="w-full gap-2 bg-zinc-900 hover:bg-zinc-950 rounded-full p-3 px-6 outline-none"
                >
                  {props.submit_fetching ? (
                    <Loader2Icon className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <FormattedMessage id="modals/ask-music/submit" />
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pb-8">
              <div className="text-sm text-zinc-400 mb-3">
                <FormattedMessage id="modals/ask-music/your-requests" />
              </div>

              {props.requests_fetching ? (
                <div className="flex justify-center py-6">
                  <Loader2Icon className="w-5 h-5 animate-spin text-zinc-500" />
                </div>
              ) : props.requests.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  <FormattedMessage id="modals/ask-music/no-requests" />
                </p>
              ) : (
                <div className="grid gap-2">
                  {props.requests.map((request) => (
                    <div
                      key={request.url}
                      className="rounded-xl bg-zinc-900 p-3 text-sm"
                    >
                      <a
                        href={request.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-200 hover:text-zinc-50 break-all"
                      >
                        {request.url}
                      </a>
                      <div
                        className={clsx(
                          "mt-2 text-xs font-medium",
                          status_classnames[request.status]
                        )}
                      >
                        <RequestStatus status={request.status} />
                      </div>
                      {request.status === "cancelled" && request.cancel_reason && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {request.cancel_reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const ModalAskMusic = connector(Wrapper);
