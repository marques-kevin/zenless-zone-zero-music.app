import { MODAL_KEYS } from "@/constants/modal-keys";

type BaseEvent<T, A, D = {}> = {
  category: T;
  action?: A;
  data?: D;
};

type TracksEvents =
  | BaseEvent<"tracks", "play", { track_id: string }>
  | BaseEvent<"tracks", "playing", { track_id: string }>
  | BaseEvent<"tracks", "pause">
  | BaseEvent<"tracks", "download", { track_id: string }>
  | BaseEvent<"tracks", "like", { track_id: string }>
  | BaseEvent<"tracks", "unlike", { track_id: string }>;

type ModalsEvents =
  | BaseEvent<"modal", "open", { type: MODAL_KEYS }>
  | BaseEvent<"modal", "close">;

type AudioEvents = BaseEvent<
  "audio",
  "loaded",
  { duration: number; track_id: string }
>;

type AuthEvents = BaseEvent<"auth", "login"> | BaseEvent<"auth", "logout">;

type ProfileEvents = BaseEvent<
  "profile",
  "change-profile-picture",
  { character: string }
>;

type DownloadAppEvents = BaseEvent<"download-app", "button-navbar-clicked">;

type GlobalEvents = BaseEvent<"global", "reload">;

export type AnalyticsEntity =
  | TracksEvents
  | ModalsEvents
  | AudioEvents
  | AuthEvents
  | ProfileEvents
  | DownloadAppEvents
  | GlobalEvents;
