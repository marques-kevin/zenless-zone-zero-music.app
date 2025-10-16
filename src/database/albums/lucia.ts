import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const LuciaTracks: Track[] = [
  {
    title: "Damidami - Lucia EP",
    title_id: "damdami",
    source: "/musics/2.3--damdami.mp3",
    duration: 195,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Damidami - Lucia EP (Instrumental Ver.)",
    title_id: "damidami-lucia-ep-instrumental-ver",
    source: "/musics/2.3--damidami-lucia-ep-instrumental-ver.mp3",
    duration: 191,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Lucia Hide and Seek Theme",
    title_id: "lucia-hide-and-seek-theme",
    source: "/musics/2.3--lucia-hide-and-seek-theme.mp3",
    duration: 158,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Lucia Hide and Seek Vocal Theme",
    title_id: "ah-deh-wandering-hunter-boss-combat-hide-and-seek-vocal-theme",
    source:
      "/musics/2.3--ah-deh-wandering-hunter-boss-combat-hide-and-seek-vocal-theme.mp3",
    duration: 108,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
].map((track) => ({
  ...track,
  ...Albums["lucia"],
}));
