import type { RhythmChart, RhythmNote, RhythmNoteLane } from "@/types/rhythm-chart.type";

const VALID_LANES: RhythmNoteLane[] = ["left", "right", "both"];

export class ChartValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChartValidationError";
  }
}

export const sortNotes = (notes: RhythmNote[]): RhythmNote[] =>
  [...notes].sort((a, b) => a.beat - b.beat || a.lane.localeCompare(b.lane));

export const validateChart = (data: unknown): RhythmChart => {
  if (!data || typeof data !== "object") {
    throw new ChartValidationError("Chart must be an object");
  }

  const chart = data as Record<string, unknown>;

  if (chart.version !== 1) {
    throw new ChartValidationError("Unsupported chart version");
  }

  if (typeof chart.track_id !== "string" || !chart.track_id) {
    throw new ChartValidationError("Invalid track_id");
  }

  if (typeof chart.bpm !== "number" || chart.bpm <= 0) {
    throw new ChartValidationError("Invalid bpm");
  }

  if (typeof chart.offset !== "number") {
    throw new ChartValidationError("Invalid offset");
  }

  if (!Array.isArray(chart.notes)) {
    throw new ChartValidationError("Notes must be an array");
  }

  const notes: RhythmNote[] = chart.notes.map((note, index) => {
    if (!note || typeof note !== "object") {
      throw new ChartValidationError(`Invalid note at index ${index}`);
    }

    const n = note as Record<string, unknown>;

    if (typeof n.beat !== "number" || n.beat < 0) {
      throw new ChartValidationError(`Invalid beat at index ${index}`);
    }

    if (!VALID_LANES.includes(n.lane as RhythmNoteLane)) {
      throw new ChartValidationError(`Invalid lane at index ${index}`);
    }

    if (n.duration !== undefined) {
      if (typeof n.duration !== "number" || n.duration <= 0) {
        throw new ChartValidationError(`Invalid duration at index ${index}`);
      }
      if (n.lane !== "both") {
        throw new ChartValidationError(
          `Duration only allowed for 'both' lane at index ${index}`
        );
      }
    }

    return {
      beat: n.beat,
      lane: n.lane as RhythmNoteLane,
      ...(n.duration !== undefined ? { duration: n.duration } : {}),
    };
  });

  return {
    version: 1,
    track_id: chart.track_id,
    bpm: chart.bpm,
    offset: chart.offset,
    notes: sortNotes(notes),
  };
};

export const parseChartJson = (json: string): RhythmChart => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new ChartValidationError("Invalid JSON");
  }
  return validateChart(parsed);
};

export const serializeChart = (chart: RhythmChart): string =>
  JSON.stringify(
    {
      ...chart,
      notes: sortNotes(chart.notes),
    },
    null,
    2
  );

export const downloadChart = (chart: RhythmChart): void => {
  const blob = new Blob([serializeChart(chart)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${chart.track_id}-chart.json`;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const createEmptyChart = (
  trackId: string,
  bpm: number,
  offset = 0
): RhythmChart => ({
  version: 1,
  track_id: trackId,
  bpm,
  offset,
  notes: [],
});
