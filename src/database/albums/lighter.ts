import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const LighterTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("lighter")
)
  .map((track) => ({
    ...track,
    ...Albums["lighter"],
  }))
  .concat([
    {
      title: "Fearless",
      title_id: "fearless-lighter-theme",
      duration: 203,
      created_at: new Date("2024-12-04"),
      source: "/musics/fearless--lighter-theme.mp3",
      ...Artists["catbang"],
      ...Albums["lighter"],
    },
  ]);
