import React from "react";

import { Drawer } from "vaul";

import { connector, ContainerProps } from "./container/modal-news.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { useModal } from "@/hooks/use-modal";
import { useIntl } from "react-intl";
import ReactMarkdown from "react-markdown";
import { GitBranchIcon } from "lucide-react";

type NewsEntry = {
  frontmatter: {
    published_at: string;
    title: string;
    description: string;
    language: string;
    commit_id?: string;
  };
  rawMarkdownBody: string;
};

type Props = ContainerProps & {
  news: NewsEntry[];
};

export const Wrapper: React.FC<Props> = (props) => {
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
                {props.news?.map((entry, index) => {
                  const date = new Date(entry.frontmatter.published_at);

                  return (
                    <div
                      key={`${entry.frontmatter.published_at}-${index}`}
                      className={
                        index === 0
                          ? "mt-4"
                          : "mt-10 border-t border-zinc-700 pt-6"
                      }
                    >
                      <div className="flex items-center justify-between gap-4 text-sm text-zinc-500">
                        <div>
                          {new Intl.DateTimeFormat(intl.locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(date)}
                        </div>
                        {entry.frontmatter.commit_id && (
                          <a
                            href={`https://github.com/marques-kevin/zenless-zone-zero-music.app/commit/${entry.frontmatter.commit_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-full border border-zinc-600 px-3 py-1 text-xs font-medium text-zinc-300 hover:text-zinc-50 hover:border-zinc-400 transition-colors"
                          >
                            <GitBranchIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {entry.frontmatter.title}
                      </div>
                      <div className="prose max-w-none text-sm prose-zinc prose-invert">
                        <ReactMarkdown>{entry.rawMarkdownBody}</ReactMarkdown>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export const ModalNews = connector(Wrapper);
