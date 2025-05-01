import { Track } from "@/types/track.type";
import { SanbyTracks } from "./sanby";
import { TriggerTracks } from "./trigger";
import { Albums } from "../albums";
import { HugoTracks } from "./hugo";

export const Album16Tracks: Track[] = [
  ...SanbyTracks,
  ...TriggerTracks,
  ...HugoTracks.filter((track) => track.artist_id === "1.6"),
].map((track) => ({
  ...track,
  ...Albums["1.6"],
}));
