import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const StarlightBillyTracks: Track[] = [
  {
    title: "Starlight Billy Henshin Theme",
    title_id: "starlight-billy-henshin-theme",
    source: "/musics/2.8--starlight-billy-henshin-theme.mp3",
    duration: 56,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Starlight Billy EP - Billy Mode (English Lyrics)",
    title_id: "starlight-billy-ep--billy-mode-english-lyrics",
    source: "/musics/2.8--starlight-billy-ep--billy-mode-english-lyrics.mp3",
    duration: 190,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Starlight Billy EP - Billy Mode (Instrumental Ver.)",
    title_id: "starlight-billy-ep--billy-mode-instrumental-ver",
    source: "/musics/2.8--s-billy-ep--billy-mode-instrumental-ver.mp3",
    duration: 190,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Starlight - Billy Battle Theme",
    title_id: "starlight--billy-battle-theme",
    source: "/musics/2.8--starlight--billy-battle-theme.mp3",
    duration: 208,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
].map((track) => ({
  ...track,
  ...Albums["starlight-billy"],
}));
