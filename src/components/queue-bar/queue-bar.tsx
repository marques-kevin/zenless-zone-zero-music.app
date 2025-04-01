import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { connector, ContainerProps } from "./container/queue-bar.container";
import { TrackInQueueItem } from "../track-in-queue-item/track-in-queue-item";
import { ListTree } from "lucide-react";
import { FormattedMessage } from "../formatted-message/formatted-message";
import { TracksList } from "../tracks-list/tracks-list";

export const Wrapper: React.FC<ContainerProps> = (props) => {
  if (props.tracks_currently_playing.length === 0) return null;

  return (
    <div className="w-[280px] hidden md:block rounded-md overflow-hidden bg-zinc-900 py-8">
      <div className="flex items-center gap-2 px-4">
        <ListTree className="h-6 w-6 text-zinc-400" />

        <span className="font-semibold text-zinc-400">
          <FormattedMessage id="queue-column/title" />
        </span>
      </div>

      <div className="h-full mt-2 overflow-auto">
        <div className="px-2">
          <div className="grid pb-2">
            <TracksList
              tracks={props.tracks_currently_playing}
              show_cover={true}
              can_be_removed_from_playlist={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const QueueBar = connector(Wrapper);
