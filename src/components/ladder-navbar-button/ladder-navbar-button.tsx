import React from "react";
import { Link } from "@reach/router";
import { TrophyIcon } from "lucide-react";

export const LadderNavbarButton: React.FC = () => {
  return (
    <Link
      to="/ladder"
      className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
    >
      <TrophyIcon className="w-5 h-5" />
    </Link>
  );
};
