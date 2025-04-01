import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const AstraYaoTracks: Track[] = [
  {
    title: "Original Me",
    title_id: "original-me",
    source: "/musics/original-me.mp3",
    duration: 60 * 3 + 43,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  {
    title: "Ridus Holidays",
    title_id: "astra-yao--ridu-holidays",
    source: "/musics/astra-yao--ridu-holidays.mp3",
    duration: 60 * 4 + 31,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
].map((track) => ({
  ...track,
  ...Albums["astra-yao"],
}));
