import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const PromeiaTracks: Track[] = [
  {
    title: "Promeia - Prey Predator Theme",
    title_id: "promeia--prey-predator-theme",
    source: "/musics/2.8--promeia--prey-predator-theme.mp3",
    duration: 32,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Promeia - Scapegoat (feat. Rosu)",
    title_id: "azari-scapegoat-feat",
    source: "/musics/2.8--azari-scapegoat-feat.mp3",
    duration: 120,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
].map((track) => ({
  ...track,
  ...Albums["promeia"],
}));
