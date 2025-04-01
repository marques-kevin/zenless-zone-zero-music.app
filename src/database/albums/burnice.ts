import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";
import { Artists } from "../artists";

export const BurniceTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("burnice")
)
  .concat([
    {
      title: "Burning Desires",
      title_id: "burning-desires",
      duration: 139,
      source: "/musics/burning-desires.mp3",
      created_at: new Date("2024-11-12"),
      ...Albums["burnice"],
      ...Artists["bangblues"],
    },
  ])
  .map((track) => ({
    ...track,
    ...Albums["burnice"],
  }));
