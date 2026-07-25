import React from "react";
import { Link, useLocation } from "@reach/router";
import { Gamepad2 } from "lucide-react";
import { languagesAvailable } from "@/constants/langs";

export const RhythmNavbarButton: React.FC = () => {
  const location = useLocation();

  const pathname = location.pathname;
  const currentLang =
    languagesAvailable.find(
      (lang) => lang.id !== "en" && pathname.startsWith(`/${lang.id}/`)
    )?.id || "en";

  const rhythmUrl =
    currentLang === "en"
      ? "/rhythm/burning-desires/"
      : `/${currentLang}/rhythm/burning-desires/`;

  return (
    <Link
      to={rhythmUrl}
      className="text-sm text-zinc-200 hover:text-zinc-50 hover:bg-zinc-700 rounded px-2 py-1.5 cursor-pointer outline-none"
    >
      <Gamepad2 className="w-5 h-5" />
    </Link>
  );
};
