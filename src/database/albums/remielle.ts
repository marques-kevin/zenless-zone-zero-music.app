import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const RemielleTracks: Track[] = [
  {
    title: "Remielle Theme",
    title_id: "remielle-theme",
    source: "/musics/2.8--remielle-theme.mp3",
    duration: 307,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Remielle - Return to Rightful Owner Theme",
    title_id: "remielle--return-to-rightful-owner-theme",
    source: "/musics/2.8--remielle--return-to-rightful-owner-theme.mp3",
    duration: 70,
    created_at: new Date("2026-05-06"),
    ...Artists["2.8"],
  },
  {
    title: "Remielle EP - \"Two to Tango\"",
    title_id: "remielle-ep-two-to-tango",
    source: "/musics/3.0--remielle-ep-two-to-tango.mp3",
    duration: 249,
    created_at: new Date("2026-07-27"),
    ...Artists["3.0"],
  },
  {
    title: "Remielle Theme (Remielle's Hideout)",
    title_id: "remielle-theme-remielle-s-hideout",
    source: "/musics/3.1--remielle-theme-remielle-s-hideout.mp3",
    duration: 318,
    created_at: new Date("2026-07-31"),
    ...Artists["3.1"],
  },
  {
    title: "Two to Tango - Remielle EP (With Lyrics)",
    title_id: "remielle-ep--two-to-tango-with-lyrics",
    source: "/musics/3.1--remielle-ep--two-to-tango-with-lyrics.mp3",
    duration: 242,
    created_at: new Date("2026-07-31"),
    ...Artists["3.1"],
  },
  {
    title: "Remielle EP - Two to Tango (Instrumental Ver.)",
    title_id: "remielle-ep--two-to-tango-instrumental-ver",
    source: "/musics/3.1--remielle-ep--two-to-tango-instrumental-ver.mp3",
    duration: 244,
    created_at: new Date("2026-07-31"),
    ...Artists["3.1"],
  },
  {
    title: "The Long Goodbye Theme (Remielle)",
    title_id: "the-long-goodbye-theme-remielle",
    source: "/musics/3.1--the-long-goodbye-theme-remielle.mp3",
    duration: 118,
    created_at: new Date("2026-07-31"),
    ...Artists["3.1"],
  },
  {
    title: "Dancing With Remielle Theme (Banquet)",
    title_id: "dancing-with-remielle-theme-banquet",
    source: "/musics/3.1--dancing-with-remielle-theme-banquet.mp3",
    duration: 200,
    created_at: new Date("2026-07-31"),
    ...Artists["3.1"],
  },
].map((track) => ({
  ...track,
  ...Albums["remielle"],
}));
