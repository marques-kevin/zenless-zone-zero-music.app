import { describe, expect, it } from "vitest";
import {
  ChartValidationError,
  createEmptyChart,
  parseChartJson,
  serializeChart,
  sortNotes,
  validateChart,
} from "../chart-io";

describe("chart-io", () => {
  const validChart = {
    version: 1,
    track_id: "burning-desires",
    bpm: 128,
    offset: 0,
    notes: [
      { beat: 4, lane: "left" },
      { beat: 8, lane: "both", duration: 2 },
      { beat: 2, lane: "right" },
    ],
  };

  it("validates a correct chart", () => {
    const chart = validateChart(validChart);
    expect(chart.track_id).toBe("burning-desires");
    expect(chart.notes).toHaveLength(3);
    expect(chart.notes[0].beat).toBe(2);
  });

  it("rejects invalid version", () => {
    expect(() =>
      validateChart({ ...validChart, version: 2 })
    ).toThrow(ChartValidationError);
  });

  it("rejects duration on non-both lanes", () => {
    expect(() =>
      validateChart({
        ...validChart,
        notes: [{ beat: 1, lane: "left", duration: 1 }],
      })
    ).toThrow(ChartValidationError);
  });

  it("parses and serializes JSON", () => {
    const json = serializeChart(validateChart(validChart));
    const parsed = parseChartJson(json);
    expect(parsed.notes).toEqual(sortNotes(validChart.notes as any));
  });

  it("creates an empty chart", () => {
    const chart = createEmptyChart("burning-desires", 128);
    expect(chart.notes).toEqual([]);
    expect(chart.bpm).toBe(128);
  });
});
