import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";

export const NekomataTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("nekomata")
).map((track) => ({
  ...track,
  ...Albums["nekomata"],
}));
