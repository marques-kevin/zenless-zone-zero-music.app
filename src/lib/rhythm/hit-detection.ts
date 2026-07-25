import type { HitJudgment, RhythmNote } from "@/types/rhythm-chart.type";
import { beatTolerance } from "./timing";

const PERFECT_MS = 50;
const GOOD_MS = 80;

export const getJudgment = (
  currentBeat: number,
  noteBeat: number,
  bpm: number
): HitJudgment | null => {
  const diffMs = Math.abs(beatToMsDiff(currentBeat, noteBeat, bpm));

  if (diffMs <= PERFECT_MS) return "perfect";
  if (diffMs <= GOOD_MS) return "good";
  return null;
};

export const isMissed = (
  currentBeat: number,
  noteBeat: number,
  bpm: number,
  toleranceMs = GOOD_MS
): boolean => {
  const diff = currentBeat - noteBeat;
  return diff > beatTolerance(toleranceMs, bpm);
};

export const isNoteActive = (
  currentBeat: number,
  note: RhythmNote,
  bpm: number
): boolean => {
  const tolerance = beatTolerance(GOOD_MS, bpm);
  const endBeat = note.beat + (note.duration ?? 0);
  return currentBeat >= note.beat - tolerance && currentBeat <= endBeat + tolerance;
};

export const getScoreForJudgment = (judgment: HitJudgment): number => {
  if (judgment === "perfect") return 300;
  if (judgment === "good") return 150;
  return 0;
};

export const getFeverGain = (judgment: HitJudgment): number => {
  if (judgment === "perfect") return 8;
  if (judgment === "good") return 4;
  return -10;
};

const beatToMsDiff = (beatA: number, beatB: number, bpm: number): number =>
  ((beatA - beatB) * 60_000) / bpm;
