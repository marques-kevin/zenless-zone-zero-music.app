import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const Album25Tracks: Track[] = [
  {
    title: "Zhao EP - Tiny Giant",
    title_id: "zhao-ep--tiny-giant",
    source: "/musics/2.5--zhao-ep--tiny-giant.mp3",
    duration: 182,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
].map((track) => ({
  ...track,
  ...Albums["2.5"],
}));

