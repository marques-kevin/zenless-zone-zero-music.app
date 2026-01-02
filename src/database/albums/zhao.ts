import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const ZhaoTracks: Track[] = [
  {
    title: "Zhao EP - Tiny Giant with English Lyrics",
    title_id: "zhao-ep-tiny-giant-with-english-lyrics",
    source: "/musics/2.5--zhao-ep-tiny-giant-with-english-lyrics.mp3",
    duration: 182,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
  {
    title: "Zhao Heroic Moment Theme - Loss and Gain",
    title_id: "zhao-heroic-moment-theme-loss-and-gain",
    source: "/musics/2.5--zhao-heroic-moment-theme-loss-and-gain.mp3",
    duration: 43,
    created_at: new Date("2025-12-26"),
    ...Artists["2.5"],
  },
].map((track) => ({
  ...track,
  ...Albums["zhao"],
}));

