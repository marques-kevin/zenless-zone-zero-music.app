import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const ClaretTracks: Track[] = [
  {
    title: "Link Up - Claret EP | Instrumental Version With English Lyrics",
    title_id: "link-up-claret-ep-instrumental-version-with-english-lyrics",
    source:
      "/musics/3.2--link-up-claret-ep-instrumental-version-with-english-lyrics.mp3",
    duration: 188,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
  {
    title: "Link Up - Claret EP | Official English Lyrics",
    title_id: "link-up-claret-ep-official-english-lyrics",
    source: "/musics/3.2--link-up-claret-ep-official-english-lyrics.mp3",
    duration: 190,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
  {
    title: "Claret Stealth Mode Theme (Transfer Station Infiltration)",
    title_id: "claret-stealth-mode-theme-transfer-station-infiltration",
    source:
      "/musics/3.2--claret-stealth-mode-theme-transfer-station-infiltration.mp3",
    duration: 253,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
  {
    title: "Claret Cutscene Theme (Unforgivable)",
    title_id: "claret-cutscene-theme-unforgivable",
    source: "/musics/3.2--claret-cutscene-theme-unforgivable.mp3",
    duration: 34,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
  {
    title: "Claret & Roxy Cutscene Theme (Secrets Behind Closed Doors)",
    title_id: "claret-roxy-cutscene-theme-secrets-behind-closed-doors",
    source:
      "/musics/3.2--claret-roxy-cutscene-theme-secrets-behind-closed-doors.mp3",
    duration: 36,
    created_at: new Date("2026-09-09"),
    ...Artists["3.2"],
  },
].map((track) => ({
  ...track,
  ...Albums["claret"],
}));
