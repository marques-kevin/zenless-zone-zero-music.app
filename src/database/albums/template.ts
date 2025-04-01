import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const Template: Track[] = [
  {
    title: "Template",
    title_id: "template",
    source: "/musics/template.mp3",
    duration: 60 * 2 + 3,
    created_at: new Date("2024-12-22"),
    ...Artists["1.4"],
    ...Albums["1.4"],
  },
];
