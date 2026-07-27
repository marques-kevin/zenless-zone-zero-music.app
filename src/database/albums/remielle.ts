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
].map((track) => ({
  ...track,
  ...Albums["remielle"],
}));
