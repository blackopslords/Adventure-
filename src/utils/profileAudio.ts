// Hybrid audio engine supporting both custom uploaded audio URLs and built-in
// synthesized ambient music themes per team profile (zero external asset failures).

export type BuiltInTrackId =
  | 'abyss-synth'
  | 'horizon-arp'
  | 'covenant-bass'
  | 'obsidian-lofi'
  | 'lantern-chime';

export interface BuiltInTrack {
  id: BuiltInTrackId;
  label: string;
  mood: string;
  frequencies: number[];
  tempoMs: number;
  wave: OscillatorType;
}

export const BUILT_IN_TRACKS: BuiltInTrack[] = [
  {
    id: 'abyss-synth',
    label: 'Abyssal Neon Pad',
    mood: 'Deep Atmospheric Synth',
    frequencies: [130.81, 164.81, 196.0, 246.94, 293.66],
    tempoMs: 1600,
    wave: 'sine',
  },
  {
    id: 'horizon-arp',
    label: 'Golden Horizon Pulse',
    mood: 'Warm Cinematic Arpeggio',
    frequencies: [146.83, 185.0, 220.0, 277.18, 329.63],
    tempoMs: 1100,
    wave: 'triangle',
  },
  {
    id: 'covenant-bass',
    label: 'Iron Vanguard Theme',
    mood: 'Dark Sub & Analog Chord',
    frequencies: [110.0, 130.81, 164.81, 220.0, 261.63],
    tempoMs: 1400,
    wave: 'sawtooth',
  },
  {
    id: 'obsidian-lofi',
    label: 'Midnight Storm Drift',
    mood: 'Moody Late-Night Lo-Fi',
    frequencies: [123.47, 146.83, 185.0, 220.0, 293.66],
    tempoMs: 1500,
    wave: 'sine',
  },
  {
    id: 'lantern-chime',
    label: 'Cliffside Lantern',
    mood: 'Calm Ambient Acoustic',
    frequencies: [174.61, 220.0, 261.63, 329.63, 392.0],
    tempoMs: 1800,
    wave: 'triangle',
  },
];

class ProfileAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private loopTimer: number | null = null;
  private htmlAudio: HTMLAudioElement | null = null;
  private stepIndex = 0;
  private volume = 0.7;
  private muted = false;
  private activeTrackId: BuiltInTrackId = 'abyss-synth';
  private activeCustomUrl: string | undefined = undefined;
  private isWantingPlay = false;

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(nextVolume: number) {
    this.volume = Math.max(0, Math.min(1, nextVolume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime,
        0.05
      );
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = this.muted ? 0 : this.volume;
    }
  }

  public setMuted(nextMuted: boolean) {
    this.muted = nextMuted;
    this.setVolume(this.volume);
  }

  public unlockFromGesture() {
    if (!this.isWantingPlay) return;
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume().catch(() => {});
    }
    if (this.htmlAudio && this.htmlAudio.paused) {
      void this.htmlAudio.play().catch(() => {});
    } else if (!this.htmlAudio && this.loopTimer === null) {
      this.play(this.activeTrackId, this.activeCustomUrl);
    }
  }

  public stop() {
    this.isWantingPlay = false;
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.htmlAudio) {
      this.htmlAudio.pause();
      this.htmlAudio.currentTime = 0;
      this.htmlAudio = null;
    }
  }

  public play(trackId: BuiltInTrackId, customAudioUrl?: string) {
    this.stop();
    this.isWantingPlay = true;
    this.activeTrackId = trackId;
    this.activeCustomUrl = customAudioUrl;

    if (customAudioUrl) {
      const audio = new Audio(customAudioUrl);
      audio.loop = true;
      audio.volume = this.muted ? 0 : this.volume;
      this.htmlAudio = audio;
      void audio.play().catch(() => {
        // Browser may block autoplay until first click/touch; unlockFromGesture() resumes it
      });
      return;
    }

    this.playSynth(trackId);
  }

  private playSynth(trackId: BuiltInTrackId) {
    this.ensureContext();
    const track =
      BUILT_IN_TRACKS.find((t) => t.id === trackId) ?? BUILT_IN_TRACKS[0];
    this.stepIndex = 0;

    const triggerNote = () => {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const freq = track.frequencies[this.stepIndex % track.frequencies.length];
      this.stepIndex += 1;

      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const env = this.ctx.createGain();

      osc.type = track.wave;
      osc.frequency.setValueAtTime(freq, now);

      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 0.5, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(track.wave === 'sawtooth' ? 680 : 1200, now);

      const dur = track.tempoMs / 1000;
      env.gain.setValueAtTime(0.0001, now);
      env.gain.exponentialRampToValueAtTime(0.22, now + dur * 0.25);
      env.gain.exponentialRampToValueAtTime(0.0001, now + dur * 1.15);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(env);
      env.connect(this.masterGain);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + dur * 1.25);
      subOsc.stop(now + dur * 1.25);
    };

    triggerNote();
    this.loopTimer = window.setInterval(triggerNote, track.tempoMs);
  }
}

export const profileAudio = new ProfileAudioEngine();
