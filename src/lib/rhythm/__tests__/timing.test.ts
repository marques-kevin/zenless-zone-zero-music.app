import { describe, expect, it } from "vitest";
import {
  beatToMs,
  msToBeat,
  snapBeat,
  beatTolerance,
  formatRhythmTime,
} from "../timing";

describe("timing", () => {
  const bpm = 128;

  it("converts beats to milliseconds", () => {
    expect(beatToMs(1, bpm)).toBeCloseTo(468.75);
    expect(beatToMs(4, bpm)).toBeCloseTo(1875);
  });

  it("converts milliseconds to beats", () => {
    expect(msToBeat(468.75, bpm)).toBeCloseTo(1);
    expect(msToBeat(1875, bpm)).toBeCloseTo(4);
  });

  it("snaps beats to grid", () => {
    expect(snapBeat(4.1)).toBe(4);
    expect(snapBeat(4.3)).toBe(4.25);
    expect(snapBeat(4.4)).toBe(4.5);
  });

  it("computes beat tolerance from ms", () => {
    expect(beatTolerance(80, bpm)).toBeCloseTo(0.17, 1);
  });

  it("formats rhythm time", () => {
    expect(formatRhythmTime(0)).toBe("0:00");
    expect(formatRhythmTime(65)).toBe("1:05");
    expect(formatRhythmTime(139)).toBe("2:19");
  });
});
