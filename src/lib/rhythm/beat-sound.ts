const BEATS_PER_MEASURE = 4;

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

  playForBeat(beat: number): void {
    if (!this.enabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const measureBeat = ((Math.round(beat) % BEATS_PER_MEASURE) + BEATS_PER_MEASURE) % BEATS_PER_MEASURE;

    if (measureBeat === 0) {
      this.playKick(ctx);
    } else {
      this.playSnare(ctx);
    }
  }

  private playKick(ctx: AudioContext): void {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.55, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(900, now);
    clickGain.gain.setValueAtTime(0.08, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start(now);
    click.stop(now + 0.04);
  }

  private playSnare(ctx: AudioContext): void {
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.07);

    const tone = ctx.createOscillator();
    const toneGain = ctx.createGain();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(220, now);
    toneGain.gain.setValueAtTime(0.06, now);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    tone.connect(toneGain);
    toneGain.connect(ctx.destination);
    tone.start(now);
    tone.stop(now + 0.05);
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
