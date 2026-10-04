import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const PhoenixTracks: Track[] = [
  {
    title: "Phoenix Intro Theme (Unexpected Visitor)",
    title_id: "phoenix-intro-theme-unexpected-visitor",
    source: "/musics/3.2--phoenix-intro-theme-unexpected-visitor.mp3",
    duration: 58,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["phoenix"],
}));
