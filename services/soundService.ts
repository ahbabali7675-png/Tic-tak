export class SoundManager {
  private context: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    try {
      if (!this.context) {
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        this.context = new AudioContextClass();
      }
      // Always try to resume if suspended (browsers often suspend until user interaction)
      if (this.context.state === 'suspended') {
        this.context.resume().catch(() => {});
      }
      return this.context;
    } catch (e) {
      console.error("Web Audio API not supported", e);
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    // Try to resume audio context on unmute interaction
    if (!muted && this.context?.state === 'suspended') {
      this.context.resume().catch(() => {});
    }
  }

  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  public playAiMove() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }

  public playWin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // C Major Arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const t = now + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  public playDraw() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  public playReset() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }
}

export const soundManager = new SoundManager();
