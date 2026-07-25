import type { RhythmChart } from "@/types/rhythm-chart.type";
import { parseChartJson, serializeChart } from "./chart-io";

const draftKey = (trackId: string) => `rhythm-chart-draft:${trackId}`;

export const saveChartDraft = (chart: RhythmChart): void => {
  try {
    window.localStorage.setItem(draftKey(chart.track_id), serializeChart(chart));
  } catch {
    // ignore quota errors
  }
};

export const loadChartDraft = (trackId: string): RhythmChart | null => {
  try {
    const raw = window.localStorage.getItem(draftKey(trackId));
    if (!raw) return null;
    return parseChartJson(raw);
  } catch {
    return null;
  }
};

export const clearChartDraft = (trackId: string): void => {
  try {
    window.localStorage.removeItem(draftKey(trackId));
  } catch {
    // ignore
  }
};
