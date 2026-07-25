import { describe, expect, it } from "vitest";
import { BeatSoundEngine } from "../beat-sound";

describe("BeatSoundEngine", () => {
  it("plays left hit sound", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(() => engine.playHit("left")).not.toThrow();
  });

  it("plays right hit sound", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(() => engine.playHit("right")).not.toThrow();
  });

  it("plays both hit sound", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(() => engine.playHit("both")).not.toThrow();
  });

  it("respects enabled flag", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(engine.isEnabled()).toBe(false);
    engine.setEnabled(true);
    expect(engine.isEnabled()).toBe(true);
  });
});
