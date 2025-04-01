import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";
import { Artists } from "../artists";

export const CaesarTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("caesar")
)
  .map((track) => ({
    ...track,
    ...Albums["caesar"],
  }))
  .concat([
    {
      title: "Pinking",
      title_id: "pinking",
      duration: 187,
      source: "/musics/pinking.mp3",
      created_at: new Date("2024-11-14"),
      ...Artists["bangblues"],
      ...Albums["caesar"],
    },
    {
      title: "Tour Inferno",
      title_id: "tour-inferno",
      duration: 266,
      source: "/musics/tour-inferno.mp3",
      created_at: new Date("2024-11-12"),
      ...Artists["bangblues"],
      ...Albums["caesar"],
    },
  ]);
