class AudioMixer {
  private static instance: AudioMixer;
  private audioContext: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private countdownGainNode: GainNode | null = null;

  private constructor() {
    // シングルトンパターン
  }

  public static getInstance(): AudioMixer {
    if (!AudioMixer.instance) {
      AudioMixer.instance = new AudioMixer();
    }
    return AudioMixer.instance;
  }

  public initialize(): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.musicGainNode = this.audioContext.createGain();
      this.countdownGainNode = this.audioContext.createGain();

      this.musicGainNode.connect(this.audioContext.destination);
      this.countdownGainNode.connect(this.audioContext.destination);

      // デフォルトの音量設定
      this.musicGainNode.gain.value = 0.7; // 音楽は70%
      this.countdownGainNode.gain.value = 1.0; // カウントダウンは100%
    }
  }

  private createBeep(frequency: number): OscillatorNode {
    if (!this.audioContext || !this.countdownGainNode) {
      throw new Error("AudioContext not initialized");
    }

    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    oscillator.connect(this.countdownGainNode);

    return oscillator;
  }

  public async playCountdownBeep(
    frequency: number = 880,
    duration: number = 0.1
  ): Promise<void> {
    if (!this.audioContext) {
      throw new Error("AudioContext not initialized");
    }

    const oscillator = this.createBeep(frequency);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public setMusicVolume(volume: number): void {
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public setCountdownVolume(volume: number): void {
    if (this.countdownGainNode) {
      this.countdownGainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public async fadeMusicVolume(
    targetVolume: number,
    duration: number
  ): Promise<void> {
    if (!this.audioContext || !this.musicGainNode) {
      throw new Error("AudioContext not initialized");
    }

    const currentTime = this.audioContext.currentTime;
    const currentVolume = this.musicGainNode.gain.value;

    this.musicGainNode.gain.cancelScheduledValues(currentTime);
    this.musicGainNode.gain.setValueAtTime(currentVolume, currentTime);
    this.musicGainNode.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, targetVolume)),
      currentTime + duration
    );
  }

  public async playCountdownSequence(count: number): Promise<void> {
    for (let i = count; i > 0; i--) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.playCountdownBeep(i === 1 ? 1760 : 880, 0.1); // 最後のビープ音は高め
          resolve();
        }, 1000 * (count - i));
      });
    }

    // 開始音
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        this.playCountdownBeep(1760, 0.15);
        setTimeout(() => {
          this.playCountdownBeep(2093, 0.15);
          resolve();
        }, 150);
      }, 1000);
    });
  }

  public setVolumeForPhase(
    phase: "preparing" | "exercise" | "rest" | "completed"
  ): void {
    switch (phase) {
      case "preparing":
        this.setMusicVolume(0.7);
        this.setCountdownVolume(1.0);
        break;
      case "exercise":
        this.setMusicVolume(0.85);
        this.setCountdownVolume(1.0);
        break;
      case "rest":
        this.setMusicVolume(1.0);
        this.setCountdownVolume(0.9);
        break;
      case "completed":
        this.setMusicVolume(1.0);
        this.setCountdownVolume(1.0);
        break;
    }
  }

  public resume(): void {
    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public suspend(): void {
    if (this.audioContext?.state === "running") {
      this.audioContext.suspend();
    }
  }
}

export const audioMixer = AudioMixer.getInstance();
