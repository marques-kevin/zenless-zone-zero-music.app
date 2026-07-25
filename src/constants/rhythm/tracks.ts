export type RhythmTrackConfig = {
  track_id: string;
  title: string;
  source: string;
  bpm: number;
  duration: number;
  playlist_cover: string;
  chart_path: string;
};

export const RHYTHM_TRACKS: Record<string, RhythmTrackConfig> = {
  "burning-desires": {
    track_id: "burning-desires",
    title: "Burning Desires",
    source: "/musics/burning-desires.mp3",
    bpm: 128,
    duration: 139,
    playlist_cover: "/characters/burnice.png",
    chart_path: "/rhythm/burning-desires.json",
  },
};

export const getRhythmTrack = (trackId: string): RhythmTrackConfig | null =>
  RHYTHM_TRACKS[trackId] ?? null;
