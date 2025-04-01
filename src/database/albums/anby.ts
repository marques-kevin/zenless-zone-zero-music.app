import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const AnbyTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("anby")
).map((track) => ({
  ...track,
  ...Albums["anby"],
}));
