import "@testing-library/jest-dom";
import { vi } from "vitest";

// AudioContextのモック
class MockAudioContext {
  destination = {};
  currentTime = 0;
  state = "running";

  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        cancelScheduledValues: vi.fn(),
      },
      connect: vi.fn(),
    };
  }

  createOscillator() {
    return {
      type: "sine",
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  resume() {
    this.state = "running";
    return Promise.resolve();
  }

  suspend() {
    this.state = "suspended";
    return Promise.resolve();
  }
}

// グローバルモックの設定
vi.stubGlobal("AudioContext", MockAudioContext);
