import { Track } from "@/types/track.type";
import { Artists } from "../artists";
import { Albums } from "../albums";

export const Album13Tracks: Track[] = [
  {
    title: "Outside Hand Headquarters",
    title_id: "outside-hand-headquarters",
    duration: 215,
    source: "/musics/outside-hand-headquarters.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "San-Z Studio Theme",
    title_id: "san-z-studio-theme",
    duration: 99,
    source: "/musics/san-z-studio-theme.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Simulated Battle Trial",
    title_id: "simulated-battle-trial",
    duration: 260,
    source: "/musics/simulated-battle-trial.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "The Mystery of Arpegio (TV Mode)",
    title_id: "the-mystery-of-arpegio-tv-mode",
    duration: 158,
    source: "/musics/the-mystery-of-arpegio--tv-mode.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Urban Stroll",
    title_id: "urban-stroll",
    duration: 176,
    source: "/musics/urban-stroll.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Battle Theme 1",
    title_id: "virtual-revenge-battle-theme-1",
    duration: 179,
    source: "/musics/virtual-revenge--battle-theme-1.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Battle Theme 2",
    title_id: "virtual-revenge-battle-theme-2",
    duration: 165,
    source: "/musics/virtual-revenge--battle-theme-2.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Cut Scene",
    title_id: "virtual-revenge-cut-scene",
    duration: 43,
    source: "/musics/virtual-revenge--cut-scene.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Story Beginning",
    title_id: "virtual-revenge-story-beginning",
    duration: 147,
    source: "/musics/virtual-revenge--story-beginning.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Story Theme",
    title_id: "virtual-revenge-story-theme",
    duration: 146,
    source: "/musics/virtual-revenge--story-theme.mp3",
    created_at: new Date("2024-11-13"),
  },
  {
    title: "Virtual Revenge - Web Theme",
    title_id: "virtual-revenge-web-theme",
    duration: 129,
    source: "/musics/virtual-revenge--web-theme.mp3",
    created_at: new Date("2024-11-13"),
  },
].map((track) => ({
  ...track,
  ...Artists["1.3"],
  ...Albums["virtual-revenge"],
}));
