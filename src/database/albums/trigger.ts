import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const TriggerTracks: Track[] = [
  {
    title: "Trigger - Battle Theme",
    title_id: "trigger--battle-theme",
    source: "/musics/trigger--battle-theme.mp3",
    duration: 60 * 4 + 59,
    created_at: new Date("2025-05-01"),
    ...Artists["1.6"],
    ...Albums["trigger"],
  },
  {
    title: "Trigger - Destruction Pulse",
    title_id: "trigger--destruction-pulse",
    source: "/musics/trigger--destruction-pulse.mp3",
    duration: 60 * 2 + 20,
    created_at: new Date("2025-05-01"),
    ...Artists["1.6"],
    ...Albums["trigger"],
  },
];
