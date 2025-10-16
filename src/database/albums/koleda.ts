import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";

export const KoledaTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("koleda")
).map((track) => ({
  ...track,
  ...Albums["koleda"],
}));
