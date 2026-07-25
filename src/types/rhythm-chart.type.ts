export type RhythmNoteLane = "left" | "right" | "both";

export type RhythmNote = {
  beat: number;
  lane: RhythmNoteLane;
  duration?: number;
};

export type RhythmChart = {
  version: 1;
  track_id: string;
  bpm: number;
  offset: number;
  notes: RhythmNote[];
};

export type RhythmGameMode = "play" | "edit";

export type HitJudgment = "perfect" | "good" | "miss";

export type JudgedNote = {
  note: RhythmNote;
  judgment: HitJudgment;
};
