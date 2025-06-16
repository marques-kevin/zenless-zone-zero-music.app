import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const VivianTracks: Track[] = [
  {
    title: "When Birds Sing",
    title_id: "vivian--when-birds-sing",
    source: "/musics/1.7.when-birds-sing.mp3",
    duration: 60 * 1 + 44,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
    ...Albums["vivian"],
  },
  {
    title: "In The Rain",
    title_id: "in-the-rain",
    source: "/musics/1.7.in-the-rain.mp3",
    duration: 60 * 3 + 0,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
    ...Albums["vivian"],
  },
  {
    title: "Love Like a Bouquet",
    title_id: "love-like-a-bouquet",
    source: "/musics/1.7.love-like-a-bouquet.mp3",
    duration: 60 * 3 + 11,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
    ...Albums["vivian"],
  },
];
