import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const YixuanTracks: Track[] = [
  {
    title: "Yixuan VS Mevorakh Full Theme",
    title_id: "yixuan-vs-mevorakh-full-theme",
    source: "/musics/2.0--yixuan-vs-mevorakh-full-theme.mp3",
    duration: 384,
    created_at: new Date("2025-07-28T17:00:29Z"),
    ...Artists["2.0"],
  },
  {
    title: "Yixuan Theme (VS Miasma Priest - Mevorakh)",
    title_id: "yixuan-theme-vs-miasma-priest-mevorakh",
    source: "/musics/2.0--yixuan-theme-vs-miasma-priest-mevorakh.mp3",
    duration: 138,
    created_at: new Date("2025-06-06T11:01:35Z"),
    ...Artists["2.0"],
  },
  {
    title: "For My Yixuan Theme - Almost (Instrumental Ver.)",
    title_id: "for-my-yixuan-theme-almost-instrumental-ver",
    source: "/musics/2.0--for-my-yixuan-theme-almost-instrumental-ver.mp3",
    duration: 287,
    created_at: new Date("2025-05-31T18:00:31Z"),
    ...Artists["2.0"],
  },
  {
    title: "Yixuan EP - For My Yixuan (Almost MV)",
    title_id: "yixuan-ep-for-my-yixuan-almost-mv",
    source: "/musics/2.0--yixuan-ep-for-my-yixuan-almost-mv.mp3",
    duration: 287,
    created_at: new Date("2025-05-31T12:20:01Z"),
    ...Artists["2.0"],
  },
  {
    title: "Yunkui Summit Yixuan Theme",
    title_id: "yunkui-summit-yixuan-theme",
    source: "/musics/1.7.yunkui-summit.mp3",
    duration: 131,
    created_at: new Date("2025-04-23T18:31:07Z"),
    ...Artists["1.7"],
  },
].map((track) => ({
  ...track,
  ...Albums["yixuan"],
}));
