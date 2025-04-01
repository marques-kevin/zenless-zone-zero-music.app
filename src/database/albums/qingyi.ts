import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const QingyiTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("qingyi")
)
  .map((track) => ({
    ...track,
    ...Albums["qingyi"],
  }))
  .concat([
    {
      title: "Crimson Pierces the Twilight",
      title_id: "crimson-pierces-the-twilight",
      source: "/musics/crimson-pierces-the-twilight.mp3",
      duration: 60 * 2 + 29,
      created_at: new Date("2025-01-06"),
      ...Artists["san-z"],
      ...Albums["qingyi"],
    },
  ]);
