import { describe, it, expect, beforeEach, vi } from "vitest";
import { audioMixer } from "../audioMixer";

describe("AudioMixer", () => {
  beforeEach(() => {
    audioMixer.initialize();
  });

  describe("音量制御", () => {
    it("音楽の音量を設定できる", () => {
      audioMixer.setMusicVolume(0.5);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(0.5);
    });

    it("カウントダウンの音量を設定できる", () => {
      audioMixer.setCountdownVolume(0.8);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["countdownGainNode"]?.gain.value).toBe(0.8);
    });

    it("音量は0-1の範囲に制限される", () => {
      audioMixer.setMusicVolume(1.5);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(1.0);

      audioMixer.setMusicVolume(-0.5);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(0);
    });
  });

  describe("フェーズ別の音量設定", () => {
    it("準備フェーズの音量設定", () => {
      audioMixer.setVolumeForPhase("preparing");
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(0.7);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["countdownGainNode"]?.gain.value).toBe(1.0);
    });

    it("運動フェーズの音量設定", () => {
      audioMixer.setVolumeForPhase("exercise");
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(0.85);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["countdownGainNode"]?.gain.value).toBe(1.0);
    });

    it("休憩フェーズの音量設定", () => {
      audioMixer.setVolumeForPhase("rest");
      // @ts-expect-error - private field access for testing
      expect(audioMixer["musicGainNode"]?.gain.value).toBe(1.0);
      // @ts-expect-error - private field access for testing
      expect(audioMixer["countdownGainNode"]?.gain.value).toBe(0.9);
    });
  });

  describe("カウントダウン音声", () => {
    it("カウントダウンシーケンスを再生できる", async () => {
      const playCountdownBeepSpy = vi.spyOn(audioMixer, "playCountdownBeep");
      await audioMixer.playCountdownSequence(3);
      expect(playCountdownBeepSpy).toHaveBeenCalledTimes(5); // 3,2,1 + 開始音2回
    });

    it("異なる周波数でビープ音を再生できる", async () => {
      // @ts-expect-error - private field access for testing
      const createBeepSpy = vi.spyOn<typeof audioMixer, "createBeep">(
        audioMixer,
        "createBeep"
      );
      await audioMixer.playCountdownBeep(1000, 0.1);
      expect(createBeepSpy).toHaveBeenCalledWith(1000);
    });
  });

  describe("AudioContext制御", () => {
    it("AudioContextを再開できる", () => {
      audioMixer.resume();
      // @ts-expect-error - private field access for testing
      expect(audioMixer["audioContext"]?.state).toBe("running");
    });

    it("AudioContextを一時停止できる", () => {
      audioMixer.suspend();
      // @ts-expect-error - private field access for testing
      expect(audioMixer["audioContext"]?.state).toBe("suspended");
    });
  });
});
