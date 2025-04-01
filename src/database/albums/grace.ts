import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const GraceTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("grace")
).map((track) => ({
  ...track,
  ...Albums["grace"],
}));
