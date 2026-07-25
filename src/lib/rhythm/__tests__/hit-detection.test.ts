import { describe, expect, it } from "vitest";
import {
  getJudgment,
  getScoreForJudgment,
  isMissed,
  isNoteActive,
} from "../hit-detection";

describe("hit-detection", () => {
  const bpm = 128;

  it("returns perfect for on-beat hits", () => {
    expect(getJudgment(4, 4, bpm)).toBe("perfect");
  });

  it("returns good for near hits", () => {
    expect(getJudgment(4.15, 4, bpm)).toBe("good");
  });

  it("returns null for far misses", () => {
    expect(getJudgment(4.5, 4, bpm)).toBeNull();
  });

  it("detects missed notes", () => {
    expect(isMissed(4.5, 4, bpm)).toBe(true);
    expect(isMissed(4.1, 4, bpm)).toBe(false);
  });

  it("detects active notes in window", () => {
    expect(
      isNoteActive(4, { beat: 4, lane: "left" }, bpm)
    ).toBe(true);
    expect(
      isNoteActive(10, { beat: 4, lane: "left" }, bpm)
    ).toBe(false);
  });

  it("scores judgments", () => {
    expect(getScoreForJudgment("perfect")).toBe(300);
    expect(getScoreForJudgment("good")).toBe(150);
    expect(getScoreForJudgment("miss")).toBe(0);
  });
});
