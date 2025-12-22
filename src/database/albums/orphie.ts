import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const OrphieTracks: Track[] = [
  {
    title: "FURY ON (With Lyrics - Orphie Magus EP)",
    title_id: "fury-on-with-lyrics-orphie-magus-ep",
    source: "/musics/2.2--fury-on-with-lyrics-orphie-magus-ep.mp3",
    duration: 193,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
  {
    title: "FURY ON (Instrumental)",
    title_id: "fury-on-instrumental",
    source: "/musics/2.2--fury-on-instrumental.mp3",
    duration: 193,
    created_at: new Date("2025-12-16"),
    ...Artists["2.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["orphie"],
}));

