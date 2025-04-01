import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const JaneTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("jane")
).map((track) => ({
  ...track,
  ...Albums["jane"],
}));
