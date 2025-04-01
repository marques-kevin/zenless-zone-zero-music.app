import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";
import { Artists } from "../artists";

export const EllenTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("ellen")
)
  .map((track) => ({
    ...track,
    ...Albums["ellen"],
  }))
  .concat([
    {
      title: "Uniform Shark Tail Scissors",
      title_id: "uniform-shark-tail-scissors",
      duration: 159,
      created_at: new Date("2024-11-14"),
      source: "/musics/ellen-joe-uniform-shark-tail-scissors.mp3",
      ...Artists["catbang"],
      ...Albums["ellen"],
    },
    {
      title: "Shark's Gotta Bite",
      title_id: "sharks-gotta-bite",
      duration: 226,
      created_at: new Date("2024-11-14"),
      source: "/musics/ellen-joe--sharks-gotta-bite.mp3",
      ...Artists["catbang"],
      ...Albums["ellen"],
    },
    {
      title: "Ellen Battle Theme",
      title_id: "astra-nomical--moments--ellen-battle-theme",
      source: "/musics/astra-nomica--moments--ellen-battle-theme.mp3",
      duration: 60 * 3 + 39,
      created_at: new Date("2025-02-08"),
      ...Artists["1.5"],
      ...Albums["ellen"],
    },
  ]);
