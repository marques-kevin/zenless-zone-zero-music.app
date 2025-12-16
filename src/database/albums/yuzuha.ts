import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const YuzuhaTracks: Track[] = [
  {
    title: "Yuzuha EP - Wonderland Trickery (Instrumental Ver.)",
    title_id: "yuzuha-ep-wonderland-trickery-instrumental-ver",
    source: "/musics/2.1--yuzuha-ep-wonderland-trickery-instrumental-ver.mp3",
    duration: 198,
    created_at: new Date("2025-12-16"),
    ...Artists["2.1"],
  },
  {
    title: "Yuzuha EP - Wonderland Trickery (Lyrics MV)",
    title_id: "yuzuha-ep-wonderland-trickery-lyrics-mv",
    source: "/musics/2.1--yuzuha-ep-wonderland-trickery-lyrics-mv.mp3",
    duration: 198,
    created_at: new Date("2025-12-16"),
    ...Artists["2.1"],
  },
].map((track) => ({
  ...track,
  ...Albums["yuzuha"],
}));
