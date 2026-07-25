import { describe, expect, it } from "vitest";
import { BeatSoundEngine } from "../beat-sound";

describe("BeatSoundEngine", () => {
  it("plays kick on measure downbeats", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(() => engine.playForBeat(0)).not.toThrow();
    expect(() => engine.playForBeat(4)).not.toThrow();
    expect(() => engine.playForBeat(8)).not.toThrow();
  });

  it("plays snare on off-beats within measure", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(() => engine.playForBeat(1)).not.toThrow();
    expect(() => engine.playForBeat(2)).not.toThrow();
    expect(() => engine.playForBeat(3)).not.toThrow();
  });

  it("respects enabled flag", () => {
    const engine = new BeatSoundEngine();
    engine.setEnabled(false);
    expect(engine.isEnabled()).toBe(false);
    engine.setEnabled(true);
    expect(engine.isEnabled()).toBe(true);
  });
});
