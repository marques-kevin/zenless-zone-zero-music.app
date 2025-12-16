import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const BanyueTracks: Track[] = [
  {
    title: "Banyue Battle Theme",
    title_id: "banyue-battle-theme",
    source: "/musics/2.4--banyue-battle-theme.mp3",
    duration: 293,
    created_at: new Date("2025-12-16"),
    ...Artists["2.4"],
  },
  {
    title: "Banyue Entrance Theme - Close Call",
    title_id: "banyue-entrance-theme-close-call",
    source: "/musics/2.4--banyue-entrance-theme--close-call.mp3",
    duration: 41,
    created_at: new Date("2025-12-16"),
    ...Artists["2.4"],
  },
  {
    title: "Banyue Past Theme - Slaughterer",
    title_id: "banyue-past-theme-slaughterer",
    source: "/musics/2.4--banyue-past-theme--slaughterer.mp3",
    duration: 56,
    created_at: new Date("2025-12-16"),
    ...Artists["2.4"],
  },
  {
    title: "Banyue EP - I Ask",
    title_id: "banyue-ep-i-ask",
    source: "/musics/2.4--banyue-ep--i-ask.mp3",
    duration: 194,
    created_at: new Date("2025-12-16"),
    ...Artists["2.4"],
  },
].map((track) => ({
  ...track,
  ...Albums["banyue"],
}));
