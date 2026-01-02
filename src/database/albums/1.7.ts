import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { HugoTracks } from "./hugo";
import { VivianTracks } from "./vivian";

export const Album17Tracks: Track[] = [
  {
    title: "Bury Your Tears With The Past - Trailer",
    title_id: "bury-your-tears-with-the-past--trailer",
    source: "/musics/1.7.bury-your-tears-with-the-past--trailer.mp3",
    duration: 60 * 1 + 52,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "If You Look Up At The Night Sky",
    title_id: "if-you-look-up-at-the-night-sky",
    source: "/musics/1.7.if-you-look-up-at-the-night-sky.mp3",
    duration: 60 * 1 + 32,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Inner Demon",
    title_id: "inner-demon",
    source: "/musics/1.7.inner-demon.mp3",
    duration: 60 * 3 + 6,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Light and Despair",
    title_id: "light-and-despair",
    source: "/musics/1.7.light-and-despair.mp3",
    duration: 60 * 2 + 23,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Say It With Flowers",
    title_id: "say-it-with-flowers",
    source: "/musics/1.7.say-it-with-flowers.mp3",
    duration: 60 * 4 + 16,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Tepes & Dina - Boss Theme",
    title_id: "tepes--dina--boss-theme",
    source: "/musics/1.7.tepes--dina--boss-theme.mp3",
    duration: 60 * 5 + 2,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Yunkui Summit",
    title_id: "yunkui-summit",
    source: "/musics/1.7.yunkui-summit.mp3",
    duration: 60 * 2 + 10,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
  },
  {
    title: "Light and Despair Theme",
    title_id: "light-and-despair-theme",
    source: "/musics/1.7--light-and-despair-theme.mp3",
    duration: 143,
    created_at: new Date("2025-12-26"),
    ...Artists["1.7"],
  },
  {
    title: "The People Exalt Tomorrow Theme",
    title_id: "the-people-exalt-tomorrow-theme",
    source: "/musics/1.7--the-people-exalt-tomorrow-theme.mp3",
    duration: 144,
    created_at: new Date("2025-12-26"),
    ...Artists["1.7"],
  },
  ...HugoTracks.filter((track) => track.artist_id === "1.7"),
  ...VivianTracks.filter((track) => track.artist_id === "1.7"),
].map((track) => ({
  ...track,
  ...Albums["1.7"],
}));
