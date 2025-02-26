class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // AudioContextはユーザーインタラクション後に初期化
    document.addEventListener(
      "click",
      () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
      },
      { once: true }
    );
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private createBeep(
    frequency: number,
    duration: number,
    volume: number = 0.1
  ): void {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public playCountdownBeep(): void {
    this.createBeep(1000, 0.08, 0.05); // 高めの音で短く
  }

  public playLastCountdownBeep(): void {
    this.createBeep(1500, 0.15, 0.1); // より高い音で長め
  }

  public playStartBeep(): void {
    // 開始音は2音を連続で鳴らす
    this.createBeep(1760, 0.15, 0.1); // A6音
    setTimeout(() => this.createBeep(2093, 0.15, 0.1), 150); // C7音
  }

  public playEndBeep(): void {
    // 終了音は低めの音を使用
    this.createBeep(440, 0.2, 0.1); // A4音
  }

  public countdown(from: number): void {
    let count = from;
    const interval = setInterval(() => {
      if (count > 0) {
        if (count <= 3) {
          this.playLastCountdownBeep(); // 最後の3カウントは異なる音
        } else {
          this.playCountdownBeep();
        }
        count--;
      } else {
        clearInterval(interval);
        this.playStartBeep();
      }
    }, 1000);
  }

  public announceExercise(): void {
    this.playStartBeep();
  }

  public announceRest(): void {
    this.playEndBeep();
  }

  public announceComplete(): void {
    // 完了音は3音を連続で鳴らす
    this.createBeep(1760, 0.15, 0.1);
    setTimeout(() => this.createBeep(2093, 0.15, 0.1), 200);
    setTimeout(() => this.createBeep(2637, 0.2, 0.1), 400);
  }
}

export const soundManager = SoundManager.getInstance();
