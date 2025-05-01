import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const EvelynTracks: Track[] = [
  {
    title: "Evelyn - Theme",
    title_id: "evelyn--theme",
    source: "/musics/evelyn--theme.mp3",
    duration: 60 * 2 + 42,
    created_at: new Date("2025-05-01"),
    ...Artists["1.5"],
    ...Albums["evelyn"],
  },
  {
    title: "Evelyn - Theme 2",
    title_id: "evelyn--theme-2",
    source: "/musics/evelyn--theme-2.mp3",
    duration: 60 * 1 + 52,
    created_at: new Date("2025-05-01"),
    ...Artists["1.5"],
    ...Albums["evelyn"],
  },
  {
    title: "Star Align",
    title_id: "evelyn--star-align",
    source: "/musics/evelyn--star-align.mp3",
    duration: 60 * 3 + 50,
    created_at: new Date("2025-05-01"),
    ...Artists["1.5"],
    ...Albums["evelyn"],
  },
];
