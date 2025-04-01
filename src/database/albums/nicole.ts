import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const NicoleTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("nicole")
).map((track) => ({
  ...track,
  ...Albums["nicole"],
}));
