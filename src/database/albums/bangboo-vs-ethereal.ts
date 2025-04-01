import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const BangbooVsEthereal: Track[] = [
  {
    title: "Bangboo vs Ethereal - Theme 1",
    title_id: "bangboo-vs-ethereal-theme",
    source: "/musics/bangboo-vs-ethereal.mp3",
    duration: 60 * 4 + 8,
    created_at: new Date("2024-12-22"),
    ...Artists["1.4"],
    ...Albums["bangboo-vs-ethereal"],
  },
  {
    title: "Bangboo vs Ethereal - Theme 2",
    title_id: "bangboo-vs-ethereal-theme-2",
    source: "/musics/bangboo-vs-ethereal--event-theme-2.mp3",
    duration: 60 * 3 + 57,
    created_at: new Date("2025-01-07"),
    ...Artists["1.4"],
    ...Albums["bangboo-vs-ethereal"],
  },
];
