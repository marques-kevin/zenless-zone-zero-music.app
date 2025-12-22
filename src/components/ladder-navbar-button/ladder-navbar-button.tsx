import React from "react";
import { Link, useLocation } from "@reach/router";
import { TrophyIcon } from "lucide-react";
import { languagesAvailable } from "@/constants/langs";
import { connector, ContainerProps } from "./container/ladder-navbar-button.container";

const Wrapper: React.FC<ContainerProps> = (props) => {
  const location = useLocation();
  
  // Extract current locale from pathname
  const pathname = location.pathname;
  const currentLang = languagesAvailable.find(
    (lang) => lang.id !== "en" && pathname.startsWith(`/${lang.id}/`)
  )?.id || "en";
  
  // Construct locale-aware URL
  const ladderUrl = currentLang === "en" 
    ? "/ladders/characters/" 
    : `/${currentLang}/ladders/characters/`;
  
  // Show red circle if user is not authenticated OR has not selected their top 5
  const should_show_indicator = !props.is_authenticated || props.ladder_selection.length === 0;
  
  return (
    <Link
      to={ladderUrl}
      className="relative text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
    >
      {should_show_indicator && (
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
      )}
      <TrophyIcon className="w-5 h-5" />
    </Link>
  );
};

export const LadderNavbarButton = connector(Wrapper);
