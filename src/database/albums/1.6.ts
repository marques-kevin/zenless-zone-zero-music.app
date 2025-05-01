import { Track } from "@/types/track.type";
import { SanbyTracks } from "./sanby";
import { TriggerTracks } from "./trigger";
import { Albums } from "../albums";

export const Album16Tracks: Track[] = [...SanbyTracks, ...TriggerTracks].map(
  (track) => ({
    ...track,
    ...Albums["1.6"],
  })
);
