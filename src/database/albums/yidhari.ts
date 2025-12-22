import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const YidhariTracks: Track[] = [
  {
    title: "Shadow of Extradition OST - Saving Yidhari Theme",
    title_id: "shadow-of-extradition-ost-saving-yidhari-theme",
    source: "/musics/2.3--shadow-of-extradition-ost--saving-yidhari-theme.mp3",
    duration: 230,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Yidhari Dream Combat Theme - When Dreams Remain Unfinished Event",
    title_id: "yidhari-dream-combat-theme-when-dreams-remain-unfinished-event",
    source:
      "/musics/2.3--yidhari-dream-combat-theme-when-dreams-remain-unfinished-event.mp3",
    duration: 160,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Yidhari Dream Combat Theme 2 - When Dreams Remain Unfinished Event",
    title_id:
      "yidhari-dream-combat-theme-2-when-dreams-remain-unfinished-event",
    source:
      "/musics/2.3--yidhari-dream-combat-theme-2-when-dreams-remain-unfinished-event.mp3",
    duration: 160,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
  {
    title: "Yidhari's Past Dream Theme - When Dreams Remain Unfinished Event",
    title_id: "yidhari-s-past-dream-theme-when-dreams-remain-unfinished-event",
    source:
      "/musics/2.3--yidhari-s-past-dream-theme-when-dreams-remain-unfinished-event.mp3",
    duration: 472,
    created_at: new Date("2025-01-16"),
    ...Artists["2.3"],
  },
].map((track) => ({
  ...track,
  ...Albums["yidhari"],
}));
