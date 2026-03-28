import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const CissiaTracks: Track[] = [
  {
    title: "Cissia VS Promeia Theme",
    title_id: "cissia-vs-promeia-theme",
    source: "/musics/2.7--cissia-vs-promeia-theme.mp3",
    duration: 83,
    created_at: new Date("2026-03-24"),
    ...Artists["2.7"],
  },
].map((track) => ({
  ...track,
  ...Albums["cissia"],
}));
