import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const Album22Tracks: Track[] = [
  {
    title: "The Final Duel",
    title_id: "the-final-duel",
    source: "/musics/2.2--the-final-duel.mp3",
    duration: 235,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["2.2"],
}));
