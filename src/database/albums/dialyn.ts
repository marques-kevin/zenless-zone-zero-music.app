import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const DialynTracks: Track[] = [
  {
    title: "Dialyn Entrance Theme - Perfect Customer Service",
    title_id: "dialyn-entrance-theme-perfect-customer-service",
    source: "/musics/2.4--dialyn-entrance-theme--perfect-customer-service.mp3",
    duration: 38,
    created_at: new Date("2025-12-16"),
    ...Artists["2.4"],
  },
].map((track) => ({
  ...track,
  ...Albums["dialyn"],
}));
