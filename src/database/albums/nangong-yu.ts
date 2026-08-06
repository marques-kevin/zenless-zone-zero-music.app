import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const NangongYuTracks: Track[] = [
  {
    title: "Fantastical-Colored Heartbeat (CN Vocal Full Ver.)",
    title_id: "fantastical-colored-heartbeat-cn-vocal-full-ver",
    source: "/musics/2.7--fantastical-colored-heartbeat-cn-vocal-full-ver.mp3",
    duration: 276,
    created_at: new Date("2026-03-24"),
    ...Artists["2.7"],
  },
  {
    title:
      "Fantastical-Colored Heartbeat (Instrumental Version) - Nangong Yu EP",
    title_id:
      "fantastical-colored-heartbeat-instrumental-version-nangong-yu-ep",
    source:
      "/musics/2.7--fantastical-colored-heartbeat-instrumental-version-nangong-yu-ep.mp3",
    duration: 276,
    created_at: new Date("2026-03-24"),
    ...Artists["2.7"],
  },
  {
    title: "Fantastical-Colored Heartbeat (JP Vocal Full Ver.)",
    title_id: "fantastical-colored-heartbeat-jp-vocal-full-ver",
    source: "/musics/2.7--fantastical-colored-heartbeat-jp-vocal-full-ver.mp3",
    duration: 276,
    created_at: new Date("2026-03-24"),
    ...Artists["2.7"],
  },
  {
    title: "Nangong Yu Character Demo - \"Full-Combo Angel\"",
    title_id: "nangong-yu-character-demo-full-combo-angel",
    source: "/musics/2.6--nangong-yu-character-demo-full-combo-angel.mp3",
    duration: 125,
    created_at: new Date("2026-08-06"),
    ...Artists["2.6"],
  },
].map((track) => ({
  ...track,
  ...Albums["nangong-yu"],
}));
