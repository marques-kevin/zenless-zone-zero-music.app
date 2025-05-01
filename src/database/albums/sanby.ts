import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const SanbyTracks: Track[] = [
  {
    title: "Sanby - Theme",
    title_id: "sanby-theme",
    source: "/musics/sanby-theme.mp3",
    duration: 60 * 4 + 45,
    created_at: new Date("2025-05-01"),
    ...Artists["1.6"],
    ...Albums["sanby"],
  },
];
