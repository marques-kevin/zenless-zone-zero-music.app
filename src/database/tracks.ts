import { Track } from "../types/track.type";
import { Artists } from "./artists";
import { Albums } from "./albums";
import { Album14 } from "./albums/1.4";
import { BangbooVsEthereal } from "./albums/bangboo-vs-ethereal";
import { UnreleasedSongs } from "./albums/unreleased-songs";
import { BillyTracks } from "./albums/billy";
import { EllenTracks } from "./albums/ellen";
import { BurniceTracks } from "./albums/burnice";
import { ZhuYuanTracks } from "./albums/zhu-yuan";
import { QingyiTracks } from "./albums/qingyi";
import { NekomataTracks } from "./albums/nekomata";
import { YanagiTracks } from "./albums/yanagi";
import { NicoleTracks } from "./albums/nicole";
import { LycaonTracks } from "./albums/lycaon";
import { CaesarTracks } from "./albums/caesar";
import { AnbyTracks } from "./albums/anby";
import { GraceTracks } from "./albums/grace";
import { JaneTracks } from "./albums/jane";
import { LighterTracks } from "./albums/lighter";
import { KoledaTracks } from "./albums/koleda";
import { AstraYaoTracks } from "./albums/astra-yao";
import { AstraNomicalMomentsTracks } from "./albums/astra-nomical--moments";

const WhenSandwichesComeAKnockinTracks: Track[] = [
  {
    title: "When Sandwiches Come a Knockin - Delivery Theme",
    title_id: "when-sandwiches-come-a-knockin--delivery-theme",
    duration: 184,
    source: "/musics/when-sandwiches-come-a-knockin--delivery-theme.mp3",
    created_at: new Date("2024-12-05"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["when-sandwiches-come-a-knockin"],
}));

const EnNahAssistantProgramTracks: Track[] = [
  {
    title: "En Nah's Theme",
    title_id: "en-nah-assistant-program-en-nah-s-theme",
    duration: 114,
    source: "/musics/en-nah-assistant-program-event.mp3",
    created_at: new Date("2024-11-20"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["en-nah-assistant-program"],
}));

const DailyLifeOfAPubsecOfficerTracks: Track[] = [
  {
    title: "Daily Life of a PubSec Officer - Office",
    title_id: "daily-life-of-a-pubsec-officer-office",
    duration: 65,
    source: "/musics/daily-life-of-a-pubsec-officer.mp3",
    created_at: new Date("2024-11-18"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["daily-life-of-a-pubsec-officer"],
}));

const CamelinaGoldenWeekTracks: Track[] = [
  {
    title: "Camelia Golden Week - City Day",
    title_id: "camelia-golden-week-city-day",
    duration: 123,
    source: "/musics/camelia-golden-week--city-day.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - City Night",
    title_id: "camelia-golden-week-city-night",
    duration: 123,
    source: "/musics/camelia-golden-week--city-night.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Ambient v1",
    title_id: "camelia-golden-week-ambient-v1",
    duration: 85,
    source: "/musics/camelia-golden-week--ambient-v1.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Ambient v2",
    title_id: "camelia-golden-week-ambient-v2",
    duration: 85,
    source: "/musics/camelia-golden-week--ambient-v2.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Combat",
    title_id: "camelia-golden-week-combat",
    duration: 106,
    source: "/musics/camelia-golden-week--combat.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Rhythm Track 1",
    title_id: "camelia-golden-week-rhythm-track-1",
    duration: 69,
    source: "/musics/camelia-golden-week--rythm-track-1.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Rhythm Track 2",
    title_id: "camelia-golden-week-rhythm-track-2",
    duration: 69,
    source: "/musics/camelia-golden-week--rythm-track-2.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Rhythm Track 3",
    title_id: "camelia-golden-week-rhythm-track-3",
    duration: 69,
    source: "/musics/camelia-golden-week--rythm-track-3.mp3",
    created_at: new Date("2024-11-19"),
  },
  {
    title: "Camelia Golden Week - Post Event",
    title_id: "camelia-golden-week-post-event",
    duration: 215,
    source: "/musics/camelia-golden-week--post-event.mp3",
    created_at: new Date("2024-11-19"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["camelia-golden-week"],
}));

const FirstClassCustomerServiceTracks: Track[] = [
  {
    title: "Hometrack",
    title_id: "first-class-customer-service-hometrack",
    duration: 20,
    source: "/musics/first-class-customer-service--hometrack.mp3",
    created_at: new Date("2024-11-18"),
  },
  {
    title: "Tuning No.1",
    title_id: "first-class-customer-service-tuning-1",
    duration: 48,
    source: "/musics/first-class-customer-service--tuning-1.mp3",
    created_at: new Date("2024-11-18"),
  },
  {
    title: "Tuning No.2",
    title_id: "first-class-customer-service-tuning-2",
    duration: 48,
    source: "/musics/first-class-customer-service--tuning-2.mp3",
    created_at: new Date("2024-11-18"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["first-class-customer-service"],
}));

const RoamingTheEtherTracks: Track[] = [
  {
    title: "Roaming the Ether - Time to Play",
    title_id: "roaming-the-ether-time-to-play",
    duration: 96,
    source: "/musics/roaming-the-ether--time-to-play.mp3",
    created_at: new Date("2024-11-17"),
  },
  {
    title: "Roaming the Ether - Derailed Order",
    title_id: "roaming-the-ether-derailed-order",
    duration: 48,
    source: "/musics/roaming-the-ether--derailed-order.mp3",
    created_at: new Date("2024-11-17"),
  },
  {
    title: "Roaming the Ether - Chaos Gamma",
    title_id: "roaming-the-ether-chaos-gamma",
    duration: 64,
    source: "/musics/roaming-the-ether--chaos-gamma.mp3",
    created_at: new Date("2024-11-17"),
  },
].map((track) => ({
  ...Artists["san-z"],
  ...track,
  ...Albums["roaming-the-ether"],
}));

const HarumasaTracks: Track[] = [
  {
    title: "Picture Book",
    title_id: "picture-book",
    duration: 2 * 60 + 31,
    created_at: new Date("2024-12-22"),
    source: "/musics/picture-book.mp3",
  },
].map((track) => ({
  ...track,
  ...Artists["1.4"],
  ...Albums["harumasa"],
}));

const MiyabiTracks: Track[] = [
  {
    title: "Daybreak",
    title_id: "daybreak",
    duration: 2 * 60 + 40,
    created_at: new Date("2024-12-22"),
    source: "/musics/daybreak.mp3",
  },
].map((track) => ({
  ...track,
  ...Artists["1.4"],
  ...Albums["miyabi"],
}));

const ComeAliveTracks: Track[] = [
  {
    title: "Come Alive",
    title_id: "come-alive",
    duration: 4 * 60 + 3,
    source: "/musics/come-alive.mp3",
    created_at: new Date("2025-01-07"),
  },
].map((track) => ({
  ...track,
  ...Artists["san-z"],
  ...Albums["come-alive"],
}));

const RandomPlayTracks: Track[] = [
  {
    title: "Outer Ring Dinner Etiquette",
    title_id: "outer-ring-dinner-etiquette",
    duration: 208,
    source: "/musics/outer-ring-dinner-etiquette.mp3",
    created_at: new Date("2024-10-10"),
  },
].map((track) => ({
  ...track,
  ...Artists["catbang"],
  ...Albums["random-play"],
}));

const LoadingTracks: Track[] = [
  {
    title: "19%",
    title_id: "loading-19-percent",
    duration: 219,
    source: "/musics/loading-19-percent.mp3",
    created_at: new Date("2024-11-17"),
  },
  {
    title: "39%",
    title_id: "loading-139-percent",
    duration: 195,
    source: "/musics/loading-39-percent.mp3",
    created_at: new Date("2024-11-17"),
  },
  {
    title: "79%",
    title_id: "loading-179-percent",
    duration: 184,
    source: "/musics/loading-79-percent.mp3",
    created_at: new Date("2024-11-17"),
  },
  {
    title: "99%",
    title_id: "loading-199-percent",
    duration: 186,
    source: "/musics/loading-99-percent.mp3",
    created_at: new Date("2024-11-17"),
  },
].map((track) => ({
  ...track,
  ...Artists["catbang"],
  ...Albums["loading"],
}));

const CasualSaviorTracks: Track[] = [
  {
    title: "Dance of Death Acoustic Version",
    title_id: "dance-of-death-acoustic-version",
    duration: 158,
    source: "/musics/dance-of-death-acoustic-version.mp3",
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Cheesetopia: Feast Variation",
    title_id: "cheesetopia-feast-variation",
    duration: 62,
    source: "/musics/cheesetopia-feast-variation.mp3",
    created_at: new Date("2024-11-12"),
  },
].map((track) => ({
  ...track,
  ...Artists["catbang"],
  ...Albums["casual-savior"],
}));

const OverlordsFeastTracks: Track[] = [
  {
    title: "Cheesetopia: Feast Variation",
    title_id: "overlords-feast-cheesetopia-feast-variation",
    duration: 62,
    source: "/musics/cheesetopia-feast-variation.mp3",
    created_at: new Date("2024-11-18"),
  },
  {
    title: "Cheesetopia",
    title_id: "overlords-feast-cheesetopia",
    duration: 133,
    source: "/musics/overlords-feast--cheesetopia.mp3",
    created_at: new Date("2024-11-18"),
    ...Artists["catbang"],
  },
].map((track) => ({
  ...Artists["bangblues"],
  ...track,
  ...Albums["overlords-feast"],
}));

const VirtualRevengeTracks: Track[] = [
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
  ...Artists["catbang"],
  ...Albums["virtual-revenge"],
}));

export const tracks: Track[] = [
  {
    title: "Sword of Corruption",
    title_id: "sword-of-corruption",
    duration: 128,
    source: "/musics/sword-of-corruption.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "60% Daily",
    title_id: "60-percent-daily",
    artist: "Catbang",
    artist_id: "catbang",
    duration: 133,
    source: "/musics/daily-loop-60-daily.mp3",
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Ballet Labyrinth - Day",
    title_id: "ballet-labyrinth-day",
    duration: 318,
    source: "/musics/ballet-labyrinth--day.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Ballet Labyrinth - Night",
    title_id: "ballet-labyrinth-night",
    duration: 297,
    source: "/musics/ballet-labyrinth--night.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Bloom of Doom",
    title_id: "bloom-of-doom",
    duration: 174,
    source: "/musics/bloom-of-doom.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Camelia Week Battle",
    title_id: "camelia-week-battle",
    artist: "Bangblues",
    artist_id: "bangblues",
    duration: 231,
    source: "/musics/camelia-week-battle.mp3",
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Chaos Alpha",
    title_id: "chaos-alpha",
    duration: 267,
    source: "/musics/chaos-alpha.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Chaos Beta",
    title_id: "chaos-beta",
    duration: 319,
    source: "/musics/chaos-beta.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Chaos Delta",
    title_id: "chaos-delta",
    duration: 258,
    source: "/musics/chaos-delta.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Purchaseable Loyalty",
    title_id: "purchaseable-loyalty",
    duration: 139,
    source: "/musics/purchaseable-loyalty.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Chaos Gamma",
    title_id: "chaos-gamma",
    duration: 273,
    source: "/musics/chaos-gamma.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Dance of Death",
    title_id: "dance-of-death",
    duration: 152,
    source: "/musics/dance-of-death.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Derailed Order - Day",
    title_id: "derailed-order-day",
    duration: 343,
    source: "/musics/derailed-order--day.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Derailed Order - Night",
    title_id: "derailed-order-night",
    duration: 308,
    source: "/musics/derailed-order--night.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Dusk in the Wilderness",
    title_id: "dusk-in-the-wilderness",
    duration: 220,
    source: "/musics/dusk-in-the-wilderness.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Endless Construction - Day",
    title_id: "endless-construction-day",
    duration: 241,
    source: "/musics/endless-construction-day--day.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Endless Construction - Night",
    title_id: "endless-construction-night",
    duration: 313,
    source: "/musics/endless-construction-day--night.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Four Armed Sword",
    title_id: "four-armed-sword",
    duration: 141,
    source: "/musics/four-armed-sword.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Long Live the King",
    title_id: "long-live-the-king",
    duration: 144,
    source: "/musics/long-live-the-king.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Metal Chimera",
    title_id: "metal-chimera",
    duration: 195,
    source: "/musics/metal-chimera.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Soil of Disaster",
    title_id: "soil-of-disaster",
    duration: 186,
    source: "/musics/soil-of-disaster.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Young Lady Greta",
    title_id: "young-lady-greta",
    duration: 96,
    source: "/musics/young-lady-greta.mp3",
    ...Artists["catbang"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Warrior Friday",
    title_id: "warrior-friday",
    duration: 95,
    source: "/musics/warrior-friday.mp3",
    ...Artists["catbang"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Wind of the Wild",
    title_id: "wind-of-the-wild",
    duration: 252,
    source: "/musics/wind-of-the-wild.mp3",
    ...Artists["bangblues"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "60% Fantasy",
    title_id: "60-percent-fantasy",
    artist: "Catbang",
    artist_id: "catbang",
    duration: 143,
    source: "/musics/60-percent-fantasy.mp3",
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "60% Daily - Leisure",
    title_id: "60-percent-daily-leisure",
    artist: "Catbang",
    artist_id: "catbang",
    duration: 126,
    source: "/musics/60-percent-daily-leisure.mp3",
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "60% Fantasy - Serenity",
    title_id: "60-percent-fantasy-serenity",
    artist: "Catbang",
    artist_id: "catbang",
    duration: 143,
    source: "/musics/60-percent-fantasy-serenity.mp3",
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "60% Daily - Freedom",
    title_id: "60-percent-daily-freedom",
    duration: 143,
    source: "/musics/60-percent-daily-freedom.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "60% Fantasy - Passion",
    title_id: "60-percent-fantasy-passion",
    duration: 139,
    source: "/musics/60-percent-fantasy-passion.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Time to Play",
    title_id: "time-to-play",
    duration: 99,
    source: "/musics/time-to-play.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Up-Up-Down-Down-Left-Left-Right-Right",
    title_id: "up-up-down-down-left-left-right-right",
    duration: 147,
    source: "/musics/up-up-down-down-left-left-right-right.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Machine Hand Ground",
    title_id: "machine-hand-ground",
    duration: 79,
    source: "/musics/machine-hand-ground.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Surprise Box, for Good or Bad",
    title_id: "surprise-box-for-good-or-bad",
    duration: 134,
    source: "/musics/surprise-box-for-good-or-bad.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Turbo",
    title_id: "turbo",
    duration: 136,
    source: "/musics/turbo.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Tipsy Muse",
    title_id: "tipsy-muse",
    duration: 147,
    source: "/musics/tipsy-muse.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Action!",
    title_id: "action",
    duration: 148,
    source: "/musics/action.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "More Action!",
    title_id: "more-action",
    duration: 136,
    source: "/musics/more-action.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Vacation!",
    title_id: "vacation",
    duration: 133,
    source: "/musics/vacation.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Extended Vacation!",
    title_id: "extended-vacation",
    duration: 175,
    source: "/musics/extended-vacation.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "HIA",
    title_id: "hia",
    duration: 106,
    source: "/musics/hia.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "VR",
    title_id: "vr",
    duration: 310,
    source: "/musics/vr.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Yesterday's Prosperity",
    title_id: "yesterday-s-prosperity",
    duration: 138,
    source: "/musics/yesterday-s-prosperity.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Watch Your Head",
    title_id: "watch-your-head",
    duration: 119,
    source: "/musics/watch-your-head.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Limbo",
    title_id: "limbo",
    duration: 128,
    source: "/musics/limbo.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Guardians Of Order",
    title_id: "guardians-of-order",
    duration: 132,
    source: "/musics/guardians-of-order.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Stage for Rodents",
    title_id: "stage-for-rodents",
    duration: 152,
    source: "/musics/stage-for-rodents.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Blaze",
    title_id: "blaze",
    duration: 114,
    source: "/musics/blaze.mp3",
    ...Artists["catbang"],
    ...Albums["daily-loop"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Roger That",
    title_id: "roger-that",
    duration: 276,
    source: "/musics/roger-that.mp3",
    ...Artists["catbang"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Meow",
    title_id: "meow",
    duration: 234,
    source: "/musics/meow.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Gears & A Smelting Pot",
    title_id: "gears-and-a-smelting-pot",
    duration: 163,
    source: "/musics/gears-and-a-smelting-pot.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Small but Great",
    title_id: "small-but-great",
    duration: 272,
    source: "/musics/small-but-great.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Real Bro Hans",
    title_id: "real-bro-hans",
    duration: 92,
    source: "/musics/real-bro-hans.mp3",
    ...Artists["catbang"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Victoria Style Service",
    title_id: "victoria-style-service",
    duration: 105,
    source: "/musics/victoria-style-service.mp3",
    ...Artists["catbang"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Shnnnn~",
    title_id: "shnnnn",
    duration: 165,
    source: "/musics/shnnnn~.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Binary Leading Lady in Blue Breen",
    title_id: "binary-leading-lady",
    duration: 188,
    source: "/musics/binary-leading-lady-in-blue-breen.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },
  {
    title: "Pride and Paranoia",
    title_id: "pride-and-paranoia",
    duration: 149,
    source: "/musics/pride-and-paranoia.mp3",
    ...Artists["bangblues"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "More Than Happy",
    title_id: "more-than-happy",
    duration: 169,
    source: "/musics/more-than-happy.mp3",
    ...Artists["catbang"],
    ...Albums["shared-earbuds"],
    created_at: new Date("2024-10-10"),
  },

  {
    title: "Duty - Chapter 2 Interlude",
    title_id: "duty-chapter-2-interlude",
    duration: 248,
    source: "/musics/duty.mp3",
    ...Artists["catbang"],
    ...Albums["eous-anthems"],
    created_at: new Date("2024-12-04"),
  },

  ...LycaonTracks,
  ...NicoleTracks,
  ...QingyiTracks,
  ...YanagiTracks,
  ...NekomataTracks,
  ...RandomPlayTracks,
  ...CasualSaviorTracks,
  ...VirtualRevengeTracks,
  ...BurniceTracks,
  ...CaesarTracks,
  ...ZhuYuanTracks,
  ...LoadingTracks,
  ...RoamingTheEtherTracks,
  ...OverlordsFeastTracks,
  ...FirstClassCustomerServiceTracks,
  ...DailyLifeOfAPubsecOfficerTracks,
  ...CamelinaGoldenWeekTracks,
  ...EnNahAssistantProgramTracks,
  ...LighterTracks,
  ...WhenSandwichesComeAKnockinTracks,
  ...Album14,
  ...HarumasaTracks,
  ...MiyabiTracks,
  ...BangbooVsEthereal,
  ...UnreleasedSongs,
  ...BillyTracks,
  ...EllenTracks,
  ...AnbyTracks,
  ...GraceTracks,
  ...JaneTracks,
  ...KoledaTracks,
  ...AstraYaoTracks,
  ...ComeAliveTracks,
  ...AstraNomicalMomentsTracks,
];
