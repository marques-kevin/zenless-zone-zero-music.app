import React from "react";
import clsx from "clsx";
import { useLocation } from "@reach/router";
import { tracks } from "../../database/tracks";
import { connector, ContainerProps } from "./container/search-modal.container";
import { MODAL_KEYS } from "@/constants/modal-keys";
import { ChevronDown } from "lucide-react";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { useMediaQuery } from "react-responsive";
import { SearchModalMobile } from "../search-modal-mobile/search-modal-mobile";
import { TracksList } from "../tracks-list/tracks-list";
import _, { uniqBy } from "lodash";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <SearchModalMobile />;
  }
  const location = useLocation();
  const isOpen = location.href?.includes(MODAL_KEYS.search);

  return (
    <div
      className={clsx(
        "rounded-t-[10px] md:rounded-none z-20 bg-zinc-900 transition-all duration-300 flex flex-col fixed bottom-0 left-0 right-0 md:absolute inset-0 pb-[141px] md:pb-0",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex justify-between items-center p-4">
        <div className="px-2 pt-4 text-zinc-400 text-lg">
          <FormattedMessage id="search-modal/list-title" />
        </div>

        <button
          onClick={() => props.onClose()}
          className="p-2 hover:bg-zinc-700 text-zinc-50 rounded-full"
        >
          <ChevronDown className="h-6 w-6 text-zinc-400" />
        </button>
      </div>

      <div className="grid px-2 md:overflow-auto">
        <TracksList
          tracks={uniqBy(
            tracks.filter((track) =>
              track.title.toLowerCase().includes(props.query.toLowerCase())
            ),
            "title_id"
          )}
          show_cover
          show_duration
        />
      </div>
    </div>
  );
};

export const SearchModal = connector(Wrapper);
