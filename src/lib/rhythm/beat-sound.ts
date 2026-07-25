export type HitSoundLane = "left" | "right" | "both";

export class BeatSoundEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled = true;
  private readonly masterVolume = 1.6;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.context) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.context = new AudioCtx();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.context.currentTime);
      this.masterGain.connect(this.context.destination);
    }

    return this.context;
  }

  private getOutput(ctx: AudioContext): AudioNode {
    return this.masterGain ?? ctx.destination;
  }

  async resume(): Promise<void> {
    const ctx = this.getContext();
    if (ctx?.state === "suspended") {
      await ctx.resume();
    }
  }

  playHit(lane: HitSoundLane): void {
    if (!this.enabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    if (lane === "left") this.playLeft(ctx);
    if (lane === "right") this.playRight(ctx);
    if (lane === "both") this.playBoth(ctx);
  }

  /** Low tom / kick — left lane */
  private playLeft(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const output = this.getOutput(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.9, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.24);

    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "square";
    click.frequency.setValueAtTime(1100, now);
    clickGain.gain.setValueAtTime(0.15, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    click.connect(clickGain);
    clickGain.connect(output);
    click.start(now);
    click.stop(now + 0.03);
  }

  /** Snare / clap — right lane */
  private playRight(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const output = this.getOutput(ctx);
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2000, now);
    filter.Q.setValueAtTime(0.6, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    noise.start(now);
    noise.stop(now + 0.08);

    const tone = ctx.createOscillator();
    const toneGain = ctx.createGain();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(380, now);
    toneGain.gain.setValueAtTime(0.28, now);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    tone.connect(toneGain);
    toneGain.connect(output);
    tone.start(now);
    tone.stop(now + 0.05);
  }

  /** Deep bass boom — both lanes */
  private playBoth(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const output = this.getOutput(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1.1, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(output);
    osc.start(now);
    osc.stop(now + 0.35);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "square";
    sub.frequency.setValueAtTime(600, now);
    sub.frequency.exponentialRampToValueAtTime(240, now + 0.1);
    subGain.gain.setValueAtTime(0.3, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    sub.connect(subGain);
    subGain.connect(output);
    sub.start(now);
    sub.stop(now + 0.14);
  }
}

export const BEAT_GUIDE_STORAGE_KEY = "rhythm-beat-guide-enabled";

export const loadBeatGuideEnabled = (): boolean => {
  try {
    const stored = window.localStorage.getItem(BEAT_GUIDE_STORAGE_KEY);
    if (stored === null) return true;
    return stored === "true";
  } catch {
    return true;
  }
};

export const saveBeatGuideEnabled = (enabled: boolean): void => {
  try {
    window.localStorage.setItem(BEAT_GUIDE_STORAGE_KEY, String(enabled));
  } catch {
    // ignore
  }
};
