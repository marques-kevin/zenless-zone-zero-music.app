import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const SeedTracks: Track[] = [
  {
    title: "Seed Agent Story - Exploration Theme",
    title_id: "seed-agent-story-exploration-theme",
    source: "/musics/2.2--seed-agent-story-exploration-theme.mp3",
    duration: 116,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed Flora Theme 1 (Extended Ver.)",
    title_id: "seed-flora-theme-1-extended-ver",
    source: "/musics/2.2--seed-flora-theme-1-extended-ver.mp3",
    duration: 201,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed Flora Theme 2 (Extended Ver.)",
    title_id: "seed-flora-theme-2-extended-ver",
    source: "/musics/2.2--seed-flora-theme-2-extended-ver.mp3",
    duration: 152,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed Flora Theme 3 - The Promised Land (Extended Ver.)",
    title_id: "seed-flora-theme-3-the-promised-land-extended-ver",
    source:
      "/musics/2.2--seed-flora-theme-3-the-promised-land-extended-ver.mp3",
    duration: 199,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed Flora Theme (Variation)",
    title_id: "seed-flora-theme-variation",
    source: "/musics/2.2--seed-flora-theme-variation.mp3",
    duration: 167,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed Theme - Final Message",
    title_id: "seed-theme-final-message",
    source: "/musics/2.2--seed-theme-final-message.mp3",
    duration: 312,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "Seed's Safe House Theme",
    title_id: "seed-s-safe-house-theme",
    source: "/musics/2.2--seed-s-safe-house-theme.mp3",
    duration: 197,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["seed"],
}));

