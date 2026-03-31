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
  {
    title: "Trigger - Lyre Squad Harmonica Theme (Homecoming)",
    title_id: "trigger--lyre-squad-harmonica-theme-homecoming",
    source: "/musics/1.6--trigger-lyre-squad-harmonica-theme-homecoming.mp3",
    duration: 161,
    created_at: new Date("2026-03-31"),
    ...Artists["1.6"],
    ...Albums["trigger"],
  },
  {
    title: "Piano Arrangement - Homecoming (Out of Sight OST)",
    title_id: "piano-arrangement-homecoming-out-of-sight-ost",
    source:
      "/musics/trigger--piano-arrangement-homecoming-out-of-sight-ost.mp3",
    duration: 128,
    created_at: new Date("2026-03-31"),
    ...Artists["1.6"],
    ...Albums["trigger"],
  },
];
