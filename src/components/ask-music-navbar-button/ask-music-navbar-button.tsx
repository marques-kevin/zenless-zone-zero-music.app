import React from "react";
import { ListMusicIcon } from "lucide-react";
import {
  connector,
  ContainerProps,
} from "./container/ask-music-navbar-button.container";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormattedMessage } from "../formatted-message/formatted-message";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={props.onClick}
            className="relative outline-none w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-700"
          >
            <ListMusicIcon className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-800 border-none mt-2 px-4 py-2 rounded">
          <FormattedMessage id="navbar/ask-music/tooltip" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const AskMusicNavbarButton = connector(Wrapper);
