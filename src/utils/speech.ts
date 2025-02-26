class SpeechManager {
  private static instance: SpeechManager;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.setJapaneseVoice();
  }

  public static getInstance(): SpeechManager {
    if (!SpeechManager.instance) {
      SpeechManager.instance = new SpeechManager();
    }
    return SpeechManager.instance;
  }

  private setJapaneseVoice() {
    // 日本語の音声を探す
    const voices = this.synthesis.getVoices();
    this.voice =
      voices.find(
        (voice) => voice.lang.startsWith("ja-") && !voice.localService
      ) || null;

    // 音声が見つからない場合は再試行
    if (!this.voice) {
      this.synthesis.onvoiceschanged = () => {
        const newVoices = this.synthesis.getVoices();
        this.voice =
          newVoices.find(
            (voice) => voice.lang.startsWith("ja-") && !voice.localService
          ) || null;
      };
    }
  }

  public speak(text: string, rate: number = 1): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "ja-JP";

    this.synthesis.speak(utterance);
  }

  public countdown(from: number): void {
    let count = from;
    const interval = setInterval(() => {
      if (count > 0) {
        this.speak(count.toString());
        count--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  public announceExercise(): void {
    this.speak("運動開始");
  }

  public announceRest(): void {
    this.speak("休憩開始");
  }

  public announceComplete(): void {
    this.speak("ワークアウト完了");
  }
}

export const speechManager = SpeechManager.getInstance();
