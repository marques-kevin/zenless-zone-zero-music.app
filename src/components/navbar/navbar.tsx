import React from "react";
import { connector, ContainerProps } from "./container/navbar.container";
import { NavbarSearchInput } from "../navbar-search-input/navbar-search-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FormattedMessage } from "@/components/formatted-message/formatted-message";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { navigate } from "@reach/router";
import { characters } from "@/database/characters";
import {
  BellIcon,
  LinkIcon,
  MessageCircle,
  RefreshCcw,
  RefreshCcwIcon,
} from "lucide-react";
import { NewsButton } from "../news-button/news-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DownloadAppButton } from "../download-app-button/download-app-button";
import { NavbarOtherTools } from "../navbar-other-tools/navbar-other-tools";

const DISCORD_URL = "https://discord.gg/8eJMfkRD3E";

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
  </svg>
);

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <div className="flex items-center justify-between px-2 md:px-6 py-4 md:py-2">
      <div className="flex items-center">
        <img src="/logo/logo.svg" alt="Spotify" className="h-10 w-10" />
      </div>

      <div className="flex-1 hidden md:flex items-center gap-2 max-w-xl mx-4">
        <NavbarSearchInput />
      </div>

      <div className="flex items-center gap-2">
        {props.deployed_git_version &&
          props.current_git_version &&
          props.deployed_git_version !== props.current_git_version && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    className="relative outline-none text-green-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700"
                    onClick={() => props.onReload()}
                  >
                    <RefreshCcwIcon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-800 border-none mt-2 px-4 py-2 rounded">
                  <FormattedMessage id="navbar/update-available" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

        <DownloadAppButton />

        <NavbarOtherTools />

        <NewsButton />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex ml-1 items-center gap-4 outline-none">
              <img
                className="h-8 w-8 rounded-full bg-zinc-700 object-cover"
                src={
                  props.profile_picture
                    ? `/characters/${props.profile_picture}.png`
                    : "/other/placeholder.png"
                }
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent className="min-w-[200px] mt-1 bg-zinc-800 rounded p-2">
              {!props.is_authenticated && (
                <DropdownMenuItem
                  onClick={() => {
                    props.onLogin();
                  }}
                  className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
                >
                  <FormattedMessage id="navbar/dropdown/login" />
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => props.onChangeProfilePicture()}
                className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
              >
                <FormattedMessage id="navbar/dropdown/change-profile-picture" />
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => props.onOpenChangeLanguage()}
                className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
              >
                <FormattedMessage id="navbar/dropdown-menu/change-language" />
              </DropdownMenuItem>

              {props.is_authenticated && (
                <DropdownMenuItem
                  onClick={() => {
                    props.onLogout();
                  }}
                  className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
                >
                  <FormattedMessage id="navbar/dropdown/logout" />
                </DropdownMenuItem>
              )}

              <div className="grid mt-2 pt-2 border-t border-zinc-700 grid-cols-3 gap-2 items-center justify-end">
                <a
                  href="https://twitter.com/KM_Marques"
                  target="_blank"
                  className="text-sm flex items-center justify-center text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.kevin-marques.com"
                  target="_blank"
                  className="text-sm flex items-center justify-center text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
                >
                  <LinkIcon className="w-4 h-4" />
                </a>

                <a
                  href={DISCORD_URL}
                  target="_blank"
                  className="text-sm flex items-center justify-center text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
                >
                  <DiscordIcon />
                </a>
              </div>

              <div className="text-xs mt-4 text-center text-zinc-400">
                Version: {props.git_version}
              </div>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const Navbar = connector(Wrapper);
