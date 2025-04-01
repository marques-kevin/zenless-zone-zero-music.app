import React from "react";
import {
  HouseIcon,
  SearchIcon,
  Bell,
  UserIcon,
  LibraryIcon,
  ListTree,
} from "lucide-react";
import { connector, ContainerProps } from "./container/mobile-navbar.container";
import { PlayerBarMobile } from "../player-bar-mobile/player-bar-mobile";
import { navigate } from "@reach/router";
import { FormattedMessage } from "../formatted-message/formatted-message";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div className="bg-zinc-900 pointer-events-auto md:hidden border-t text-zinc-50 border-zinc-800 fixed z-10 bottom-0 w-full">
      <PlayerBarMobile />

      <div className="grid grid-cols-4 relative">
        <div
          onClick={props.onClickHome}
          className="flex items-center justify-center p-4"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-zinc-50 hover:bg-[#1A1A1A]">
              <HouseIcon className="h-4 w-4" />
            </div>
            <div className="text-xs text-zinc-400">
              <FormattedMessage id="mobile-navbar/home" />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate("#search")}
          className="flex items-center justify-center p-4"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-zinc-50 hover:bg-[#1A1A1A]">
              <SearchIcon className="h-4 w-4" />
            </div>
            <div className="text-xs text-zinc-400">
              <FormattedMessage id="mobile-navbar/search" />
            </div>
          </div>
        </div>

        <div
          onClick={props.onClickPlaylists}
          className="flex items-center justify-center p-4"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-zinc-50 hover:bg-[#1A1A1A]">
              <LibraryIcon className="h-4 w-4" />
            </div>
            <div className="text-xs text-zinc-400">
              <FormattedMessage id="mobile-navbar/library" />
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-center p-4"
          onClick={props.onClickQueue}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-zinc-50 hover:bg-[#1A1A1A]">
              <ListTree className="h-4 w-4" />
            </div>
            <div className="text-xs overflow-hidden text-nowrap whitespace-nowrap text-ellipsis text-zinc-400">
              <FormattedMessage id="mobile-navbar/queue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileNavbar = connector(Wrapper);
