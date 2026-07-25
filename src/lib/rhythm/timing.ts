export const GRID_SNAP = 0.25;

export const beatToMs = (beat: number, bpm: number): number =>
  (beat * 60_000) / bpm;

export const msToBeat = (ms: number, bpm: number): number =>
  (ms * bpm) / 60_000;

export const snapBeat = (beat: number, snap = GRID_SNAP): number =>
  Math.round(beat / snap) * snap;

export const beatTolerance = (toleranceMs: number, bpm: number): number =>
  msToBeat(toleranceMs, bpm);

export const formatRhythmTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getNoteKey = (beat: number, lane: string): string =>
  `${beat}-${lane}`;
