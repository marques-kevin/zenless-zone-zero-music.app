export type HitSoundLane = "left" | "right" | "both";

export class BeatSoundEngine {
  private context: AudioContext | null = null;
  private enabled = true;

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
    }

    return this.context;
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

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.45, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  /** Snare / clap — right lane */
  private playRight(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(0.8, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.06);

    const tone = ctx.createOscillator();
    const toneGain = ctx.createGain();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(320, now);
    toneGain.gain.setValueAtTime(0.1, now);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    tone.connect(toneGain);
    toneGain.connect(ctx.destination);
    tone.start(now);
    tone.stop(now + 0.04);
  }

  /** Deep bass boom — both lanes */
  private playBoth(ctx: AudioContext): void {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "triangle";
    sub.frequency.setValueAtTime(520, now);
    sub.frequency.exponentialRampToValueAtTime(260, now + 0.08);
    subGain.gain.setValueAtTime(0.12, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.12);
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
