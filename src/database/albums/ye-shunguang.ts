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
  {
    title: "Ye Shunguang Music Box Theme Variation",
    title_id: "ye-shunguang-music-box-theme-variation",
    source: "/musics/2.5--ye-shunguang-music-box-theme-variation.mp3",
    duration: 149,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
  {
    title: "Ye Shunguang Theme",
    title_id: "ye-shunguang-theme",
    source: "/musics/2.5--ye-shunguang-theme.mp3",
    duration: 36,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
  {
    title: "Ye Shunguang's Sacrifice Theme - The Final Choice",
    title_id: "ye-shunguang-s-sacrifice-theme-the-final-choice",
    source: "/musics/2.5--ye-shunguang-s-sacrifice-theme-the-final-choice.mp3",
    duration: 46,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
  {
    title: "Xiao Guang's Music Box Theme",
    title_id: "xiao-guang-s-music-box-theme",
    source: "/musics/2.5--xiao-guang-s-music-box-theme.mp3",
    duration: 246,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
  {
    title: "Phaethon Saving Ye Shunguang Theme - The Hand in the Dark",
    title_id: "phaethon-saving-ye-shunguang-theme-the-hand-in-the-dark",
    source: "/musics/2.5--phaethon-saving-ye-shunguang-theme-the-hand-in-the-dark.mp3",
    duration: 89,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
].map((track) => ({
  ...track,
  ...Albums["ye-shunguang"],
}));

