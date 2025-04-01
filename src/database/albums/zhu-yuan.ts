import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const ZhuYuanTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("zhu-yuan")
)
  .map((track) => ({
    ...track,
    ...Albums["zhu-yuan"],
  }))
  .concat([
    {
      title: "As the sugar cube floats, fleeting in time",
      title_id: "as-the-sugar-cube-floats-fleeting-in-time",
      duration: 211,
      created_at: new Date("2024-11-14"),
      source: "/musics/as-the-sugar-cube-floats-fleeting-in-time.mp3",
      ...Artists["catbang"],
      ...Albums["zhu-yuan"],
    },
    {
      title: "Hands Up",
      title_id: "hands-up",
      duration: 131,
      created_at: new Date("2024-11-14"),
      source: "/musics/hands-up.mp3",
      ...Artists["catbang"],
      ...Albums["zhu-yuan"],
    },
  ]);
