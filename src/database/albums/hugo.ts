import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const HugoTracks: Track[] = [
  {
    title: "Hugo - Boss Theme",
    title_id: "hugo--boss-theme",
    source: "/musics/hugo--boss-theme.mp3",
    duration: 60 * 3 + 59,
    created_at: new Date("2025-05-01"),
    ...Artists["1.6"],
    ...Albums["hugo"],
  },
  {
    title: "My Curse My Fate",
    title_id: "hugo--my-curse-my-fate",
    source: "/musics/1.7.my-curse-my-fate.mp3",
    duration: 60 * 4 + 8,
    created_at: new Date("2025-06-16"),
    ...Artists["1.7"],
    ...Albums["hugo"],
  },
];
