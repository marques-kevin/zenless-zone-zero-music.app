import { Track } from "@/types/track.type";
import { Albums } from "../albums";
import { Artists } from "../artists";

export const DreamlandFestTracks: Track[] = [
  {
    title: "Opening",
    title_id: "dreamland-fest--opening",
    source: "/musics/dreamland-fest--opening.mp3",
    duration: 64,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Too Many Void Hunters",
    title_id: "dreamland-fest--too-many-void-hunters",
    source: "/musics/dreamland-fest--too-many-void-hunters.mp3",
    duration: 168,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Tiny Giant (Remix)",
    title_id: "dreamland-fest--tiny-giant-remix",
    source: "/musics/dreamland-fest--tiny-giant-remix.mp3",
    duration: 202,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "ReDreaming Angel (Japanese Delusion Angel Cast ver.)",
    title_id:
      "dreamland-fest--redreaming-angel-japanese-delusion-angel-cast-ver",
    source:
      "/musics/dreamland-fest--redreaming-angel-japanese-delusion-angel-cast-ver.mp3",
    duration: 196,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Everyday",
    title_id: "dreamland-fest--everyday",
    source: "/musics/dreamland-fest--everyday.mp3",
    duration: 211,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Dig Down!!",
    title_id: "dreamland-fest--dig-down",
    source: "/musics/dreamland-fest--dig-down.mp3",
    duration: 181,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Moe Chakka Fire (Hugo, Komado Mato, Light, Severian ver.)",
    title_id:
      "dreamland-fest--moe-chakka-fire-hugo-komado-mato-light-severian-ver",
    source:
      "/musics/dreamland-fest--moe-chakka-fire-hugo-komado-mato-light-severian-ver.mp3",
    duration: 170,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "As You Wish",
    title_id: "dreamland-fest--as-you-wish",
    source: "/musics/dreamland-fest--as-you-wish.mp3",
    duration: 234,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Nya Nya Nya Chunya",
    title_id: "dreamland-fest--nya-nya-nya-chunya",
    source: "/musics/dreamland-fest--nya-nya-nya-chunya.mp3",
    duration: 161,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Why Still Alive!?",
    title_id: "dreamland-fest--why-still-alive",
    source: "/musics/dreamland-fest--why-still-alive.mp3",
    duration: 171,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Rose",
    title_id: "dreamland-fest--rose",
    source: "/musics/dreamland-fest--rose.mp3",
    duration: 185,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Fresh to Death",
    title_id: "dreamland-fest--fresh-to-death",
    source: "/musics/dreamland-fest--fresh-to-death.mp3",
    duration: 157,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Heart",
    title_id: "dreamland-fest--heart",
    source: "/musics/dreamland-fest--heart.mp3",
    duration: 172,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Defense Angel",
    title_id: "dreamland-fest--defense-angel",
    source: "/musics/dreamland-fest--defense-angel.mp3",
    duration: 366,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Praise! Absolute Academic Rights Lady Lucia",
    title_id: "dreamland-fest--praise-absolute-academic-rights-lady-lucia",
    source:
      "/musics/dreamland-fest--praise-absolute-academic-rights-lady-lucia.mp3",
    duration: 246,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Rise Up",
    title_id: "dreamland-fest--rise-up",
    source: "/musics/dreamland-fest--rise-up.mp3",
    duration: 238,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Escort",
    title_id: "dreamland-fest--escort",
    source: "/musics/dreamland-fest--escort.mp3",
    duration: 214,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Afterimage City",
    title_id: "dreamland-fest--afterimage-city",
    source: "/musics/dreamland-fest--afterimage-city.mp3",
    duration: 200,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Bad Grade",
    title_id: "dreamland-fest--bad-grade",
    source: "/musics/dreamland-fest--bad-grade.mp3",
    duration: 148,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "404: Find Me",
    title_id: "dreamland-fest--404-find-me",
    source: "/musics/dreamland-fest--404-find-me.mp3",
    duration: 244,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Spooky Shack",
    title_id: "dreamland-fest--spooky-shack",
    source: "/musics/dreamland-fest--spooky-shack.mp3",
    duration: 188,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Marchenstunde",
    title_id: "dreamland-fest--marchenstunde",
    source: "/musics/dreamland-fest--marchenstunde.mp3",
    duration: 265,
    created_at: new Date("2026-07-04"),
  },
  {
    title: "Ending (404: Find Me)",
    title_id: "dreamland-fest--ending-404-find-me",
    source: "/musics/dreamland-fest--ending-404-find-me.mp3",
    duration: 210,
    created_at: new Date("2026-07-04"),
  },
].map((track) => ({
  ...track,
  ...Artists.hoyofair,
  ...Albums["dreamland-fest"],
}));
