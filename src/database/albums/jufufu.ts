import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const JufufuTracks: Track[] = [
  {
    title: "Ju Fufu Agent Story - Exploration Theme",
    title_id: "ju-fufu-agent-story-exploration-theme",
    source: "/musics/2.0--ju-fufu-agent-story-exploration-theme.mp3",
    duration: 177,
    created_at: new Date("2025-06-25T07:15:07Z"),
    ...Artists["2.0"],
  },
  {
    title: "Ju Fufu Agent Story - Battle Theme",
    title_id: "ju-fufu-agent-story-battle-theme",
    source: "/musics/2.0--ju-fufu-agent-story-battle-theme.mp3",
    duration: 207,
    created_at: new Date("2025-06-25T07:00:24Z"),
    ...Artists["2.0"],
  },
  {
    title: "Ju Fufu - Self-Cultivation Through Food (Lyrics MV)",
    title_id: "ju-fufu-self-cultivation-through-food-lyrics-mv",
    source: "/musics/2.0--ju-fufu-self-cultivation-through-food-lyrics-mv.mp3",
    duration: 207,
    created_at: new Date("2025-06-23T06:13:01Z"),
    ...Artists["2.0"],
  },
  {
    title: "Ju Fufu EP - Self-Cultivation Through Food (Instrumental Ver.)",
    title_id: "ju-fufu-ep-self-cultivation-through-food-instrumental-ver",
    source:
      "/musics/2.0--ju-fufu-ep-self-cultivation-through-food-instrumental-ver.mp3",
    duration: 207,
    created_at: new Date("2025-06-23T05:00:21Z"),
    ...Artists["2.0"],
  },
].map((track) => ({
  ...track,
  ...Albums["jufufu"],
}));
