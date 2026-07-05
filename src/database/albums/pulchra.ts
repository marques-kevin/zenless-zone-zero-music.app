import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const PulchraTracks: Track[] = [
  {
    title: "Bellum Pulchra Mors Boss Theme - Purchaseable Loyalty",
    title_id: "bellum-pulchra-mors-boss-theme--purchaseable-loyalty",
    source:
      "/musics/pulchra--bellum-pulchra-mors-boss-theme--purchaseable-loyalty.mp3",
    duration: 265,
    created_at: new Date("2024-10-10"),
    ...Artists["bangblues"],
  },
].map((track) => ({
  ...track,
  ...Albums["pulchra"],
}));
