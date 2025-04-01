import React from "react";

import { ExternalLinkIcon, LayoutGridIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { FormattedMessage } from "../formatted-message/formatted-message";

const Item = (props: {
  title: React.ReactNode;
  description: React.ReactNode;
  href: string;
}) => {
  return (
    <a
      href={props.href}
      target="_blank"
      className=" text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded p-4 py-2 cursor-pointer outline-none"
    >
      <div className="text-sm flex items-center gap-1">
        {props.title} <ExternalLinkIcon className="h-3 w-3" />
      </div>
      <div className="text-xs text-zinc-400">{props.description}</div>
    </a>
  );
};

export const NavbarOtherTools: React.FC = (props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="relative outline-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700">
          <LayoutGridIcon className="h-5 w-5" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="max-w-[400px] w-full mt-1 bg-zinc-800 rounded py-4">
          <div className="text-sm text-zinc-200 mx-4 border-b border-zinc-700 pb-2">
            <FormattedMessage id="navbar-other-tools/title" />
          </div>

          <div className="grid grid-cols-1 gap-2 mt-4">
            <Item
              title={
                <FormattedMessage id="navbar-other-tools/leveling-calculator/title" />
              }
              description={
                <FormattedMessage id="navbar-other-tools/leveling-calculator/description" />
              }
              href="https://zenless.tools/leveling-calculator?utm_source=zenless-zone-zero-music-app"
            />
            <Item
              title={
                <FormattedMessage id="navbar-other-tools/comic-generator/title" />
              }
              description={
                <FormattedMessage id="navbar-other-tools/comic-generator/description" />
              }
              href="https://zenless.tools/comic-generator?utm_source=zenless-zone-zero-music-app"
            />
            <Item
              title={
                <FormattedMessage id="navbar-other-tools/chat-generator/title" />
              }
              description={
                <FormattedMessage id="navbar-other-tools/chat-generator/description" />
              }
              href="https://zenless.tools/chat-generator?utm_source=zenless-zone-zero-music-app"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
