import { SpotifyPlayer, SpotifyPlaybackState } from "../types/spotify";
import { SpotifyAuthManager } from "./spotifyAuth";
import { audioMixer } from "./audioMixer";

export class SpotifyPlayerManager {
  private static instance: SpotifyPlayerManager;
  private player: SpotifyPlayer | null = null;
  private audioMixer = audioMixer;

  private constructor() {
    // シングルトンパターン
  }

  public static getInstance(): SpotifyPlayerManager {
    if (!SpotifyPlayerManager.instance) {
      SpotifyPlayerManager.instance = new SpotifyPlayerManager();
    }
    return SpotifyPlayerManager.instance;
  }

  public initialize(): void {
    this.player = SpotifyAuthManager.getInstance().getPlayer();
    if (!this.player) {
      throw new Error("Spotify player not initialized");
    }
    this.audioMixer.initialize();
  }

  public async play(uri?: string): Promise<void> {
    if (!this.player) return;

    try {
      const state = await this.player.getCurrentState();
      if (state?.paused) {
        await this.player.resume();
      } else if (!state) {
        // TODO: 新しい曲を再生する処理
        console.log("Starting new playback with URI:", uri);
      }
    } catch (error) {
      console.error("Failed to play:", error);
      throw error;
    }
  }

  public async pause(): Promise<void> {
    if (!this.player) return;

    try {
      const state = await this.player.getCurrentState();
      if (state && !state.paused) {
        await this.player.pause();
      }
    } catch (error) {
      console.error("Failed to pause:", error);
      throw error;
    }
  }

  public async setVolume(volume: number): Promise<void> {
    if (!this.player) return;

    try {
      // 0-1の範囲に制限
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      await this.player.setVolume(normalizedVolume);
      this.audioMixer.setMusicVolume(normalizedVolume);
    } catch (error) {
      console.error("Failed to set volume:", error);
      throw error;
    }
  }

  public async fadeVolume(
    targetVolume: number,
    duration: number
  ): Promise<void> {
    if (!this.player) return;

    try {
      // 0-1の範囲に制限
      const normalizedVolume = Math.max(0, Math.min(1, targetVolume));
      await this.player.setVolume(normalizedVolume);
      await this.audioMixer.fadeMusicVolume(normalizedVolume, duration);
    } catch (error) {
      console.error("Failed to fade volume:", error);
      throw error;
    }
  }

  public async getCurrentState(): Promise<SpotifyPlaybackState | null> {
    if (!this.player) return null;

    try {
      return await this.player.getCurrentState();
    } catch (error) {
      console.error("Failed to get current state:", error);
      throw error;
    }
  }

  public async togglePlayPause(): Promise<void> {
    if (!this.player) return;

    try {
      await this.player.togglePlay();
    } catch (error) {
      console.error("Failed to toggle play/pause:", error);
      throw error;
    }
  }

  public setVolumeForPhase(
    phase: "preparing" | "exercise" | "rest" | "completed"
  ): void {
    this.audioMixer.setVolumeForPhase(phase);
  }

  public async playCountdownSequence(count: number): Promise<void> {
    await this.audioMixer.playCountdownSequence(count);
  }

  public disconnect(): void {
    if (this.player) {
      this.player.disconnect();
    }
  }
}

export const spotifyPlayer = SpotifyPlayerManager.getInstance();
