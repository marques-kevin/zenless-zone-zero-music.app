import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const LycaonTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("lycaon")
)
  .map((track) => ({
    ...track,
    ...Albums["lycaon"],
  }))
  .concat([
    {
      title: "Fangs, Claws, and a Smile",
      title_id: "fangs-claws-and-a-smile",
      duration: 144,
      source: "/musics/fangs-claws-and-a-smile.mp3",
      ...Artists["bangblues"],
      ...Albums["lycaon"],
      created_at: new Date("2024-10-10"),
    },
    {
      title: "Wolfishly Charming",
      title_id: "wolfishly-charming",
      duration: 60 + 38,
      source: "/musics/agent-mix--lycaon.mp3",
      created_at: new Date("2025-01-06"),
      ...Artists["bangblues"],
      ...Albums["lycaon"],
    },
  ]);
