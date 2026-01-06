import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { UnreleasedSongs } from "./unreleased-songs";
import { Artists } from "../artists";

export const RinaTracks: Track[] = UnreleasedSongs.filter(
  (track) =>
    track.title_id.includes("rina") || track.title_id.includes("rabbit")
)
  .map((track) => ({
    ...track,
    ...Albums["rina"],
  }))
  .concat([
    {
      title: "Rina Agent Story Combat Theme",
      title_id: "rina-agent-story-combat-theme",
      source: "/musics/1.0--rina-agent-story-combat-theme.mp3",
      duration: 159,
      created_at: new Date("2026-01-02"),
      ...Artists["san-z"],
      ...Albums["rina"],
    },
  ]);
