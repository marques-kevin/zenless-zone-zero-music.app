import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const YeShunguangTracks: Track[] = [
  {
    title: "Ye Shunguang EP - A Thousand First Meetings",
    title_id: "ye-shunguang-ep--a-thousand-first-meetings",
    source: "/musics/2.5--ye-shunguang-ep--a-thousand-first-meetings.mp3",
    duration: 292,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
].map((track) => ({
  ...track,
  ...Albums["ye-shunguang"],
}));

