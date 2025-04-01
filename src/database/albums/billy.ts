import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";

export const BillyTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("billy")
).map((track) => ({
  ...track,
  ...Albums["billy"],
}));
