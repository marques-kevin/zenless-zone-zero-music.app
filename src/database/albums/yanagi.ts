import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";
import { UnreleasedSongs } from "./unreleased-songs";

export const YanagiTracks: Track[] = UnreleasedSongs.filter((track) =>
  track.title_id.includes("yanagi")
)
  .map((track) => ({
    ...track,
    ...Albums["yanagi"],
  }))
  .concat([
    {
      title: "Rest Awhile",
      title_id: "rest-awhile",
      source: "/musics/rest-awhile.mp3",
      duration: 60 * 2 + 47,
      created_at: new Date("2025-01-06"),
      ...Artists["san-z"],
      ...Albums["yanagi"],
    },
  ]);
