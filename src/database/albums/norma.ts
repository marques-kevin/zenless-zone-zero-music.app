import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const NormaTracks: Track[] = [
  {
    title: "Norma - Future Bangboo Lab Theme",
    title_id: "norma--future-bangboo-lab-theme",
    source: "/musics/3.0--norma--future-bangboo-lab-theme.mp3",
    duration: 227,
    created_at: new Date("2026-06-17"),
    ...Artists["3.0"],
  },
  {
    title: "Norma Secret Operation Theme",
    title_id: "norma-secret-operation-theme",
    source: "/musics/3.0--norma-secret-operation-theme.mp3",
    duration: 166,
    created_at: new Date("2026-06-17"),
    ...Artists["3.0"],
  },
  {
    title: "Stress Test Battle Theme (Norma Event)",
    title_id: "stress-test-battle-theme-norma-event",
    source: "/musics/3.0--stress-test-battle-theme-norma-event.mp3",
    duration: 126,
    created_at: new Date("2026-06-17"),
    ...Artists["3.0"],
  },
  {
    title: "Data Domain Training Battle Theme (Norma Event)",
    title_id: "data-domain-training-battle-theme-norma-event",
    source: "/musics/3.0--data-domain-training-battle-theme-norma-event.mp3",
    duration: 126,
    created_at: new Date("2026-06-17"),
    ...Artists["3.0"],
  },
  {
    title: "Norma Event Ending Theme - Because Tomorrow Still Comes",
    title_id: "norma-event-ending-theme--because-tomorrow-still-comes",
    source:
      "/musics/3.0--norma-event-ending-theme--because-tomorrow-still-comes.mp3",
    duration: 102,
    created_at: new Date("2026-06-17"),
    ...Artists["3.0"],
  },
].map((track) => ({
  ...track,
  ...Albums["norma"],
}));
