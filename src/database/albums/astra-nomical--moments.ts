import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { AstraYaoTracks } from "./astra-yao";
import { EllenTracks } from "./ellen";

export const AstraNomicalMomentsTracks: Track[] = [
  ...AstraYaoTracks,
  {
    title: "Astra-Nomical Moment - Web Theme",
    title_id: "astra-nomical--moment-web",
    source: "/musics/astra-nomica--moments--web-theme.mp3",
    duration: 60 * 2 + 43,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  {
    title: "Astra-Nomical Moment - Battle Theme 1",
    title_id: "astra-nomical--moments--battle-theme-1",
    source: "/musics/astra-nomica--moments--battle-theme-1.mp3",
    duration: 60 * 3 + 25,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  {
    title: "Astra-Nomical Moment - Battle Theme 2",
    title_id: "astra-nomical--moments--battle-theme-2",
    source: "/musics/astra-nomica--moments--battle-theme-2.mp3",
    duration: 60 * 2 + 35,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  {
    title: "Astra-Nomical Moment - Battle Theme 3",
    title_id: "astra-nomical--moments--battle-theme-3",
    source: "/musics/astra-nomica--moments--battle-theme-3.mp3",
    duration: 60 * 2 + 2,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  {
    title: "Astra-Nomical Moment - Lady de Winter",
    title_id: "astra-nomical--moments--lady-de-winter",
    source: "/musics/astra-nomica--moments--lady-de-winter.mp3",
    duration: 60 * 2 + 56,
    created_at: new Date("2025-02-08"),
    ...Artists["1.5"],
  },
  EllenTracks.find(
    (track) => track.title_id === "astra-nomical--moments--ellen-battle-theme"
  ) as Track,
].map((track) => ({
  ...track,
  ...Albums["astra-nomical--moment"],
}));
