import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { IsoldeTracks } from "./isolde";

export const Album22Tracks: Track[] = [...IsoldeTracks].map((track) => ({
  ...track,
  ...Albums["2.2"],
}));
