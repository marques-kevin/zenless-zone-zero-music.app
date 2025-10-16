import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const IsoldeTracks: Track[] = [
  {
    title: "Isolde - The Final Duel Theme",
    title_id: "the-final-duel",
    source: "/musics/2.2--the-final-duel.mp3",
    duration: 235,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
    ...Albums["isolde"],
  },
  {
    title: "Isolde - The Final Duel Theme (Extended Ver.)",
    title_id: "isolde-the-final-duel-theme-extended-ver",
    source: "/musics/2.2--isolde-the-final-duel-theme-extended-ver.mp3",
    duration: 335,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
    ...Albums["isolde"],
  },
  {
    title: "The Defiler Boss Theme (Intro)",
    title_id: "the-defiler-boss-theme-unextinguished-through-the-night-intro",
    source:
      "/musics/2.2--the-defiler-boss-theme-unextinguished-through-the-night-intro.mp3",
    duration: 78,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
    ...Albums["isolde"],
  },
  {
    title: "The Defiler Boss Theme (Battle Theme)",
    title_id:
      "the-defiler-boss-theme-unextinguished-through-the-night-battle-theme",
    source:
      "/musics/2.2--the-defiler-boss-theme-unextinguished-through-the-night-battle-theme.mp3",
    duration: 177,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
    ...Albums["isolde"],
  },
  {
    title: "The Defiler Boss Theme (Outro)",
    title_id: "the-defiler-boss-theme-unextinguished-through-the-night-outro",
    source:
      "/musics/2.2--the-defiler-boss-theme-unextinguished-through-the-night-outro.mp3",
    duration: 72,
    created_at: new Date("2025-01-16"),
    ...Artists["2.2"],
    ...Albums["isolde"],
  },
];
