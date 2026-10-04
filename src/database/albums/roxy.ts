import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const RoxyTracks: Track[] = [
  {
    title: "Claret & Roxy Cutscene Theme (Secrets Behind Closed Doors)",
    title_id: "claret-roxy-cutscene-theme-secrets-behind-closed-doors",
    source:
      "/musics/3.2--claret-roxy-cutscene-theme-secrets-behind-closed-doors.mp3",
    duration: 36,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["roxy"],
}));
