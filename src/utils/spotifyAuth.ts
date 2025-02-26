import {
  SpotifyAuth,
  SpotifyPlayer,
  SpotifyPlayerOptions,
} from "../types/spotify";

const SPOTIFY_SDK_URL = "https://sdk.scdn.co/spotify-player.js";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export class SpotifyAuthManager {
  private static instance: SpotifyAuthManager;
  private player: SpotifyPlayer | null = null;
  private auth: SpotifyAuth | null = null;

  private constructor() {
    // シングルトンパターン
  }

  public static getInstance(): SpotifyAuthManager {
    if (!SpotifyAuthManager.instance) {
      SpotifyAuthManager.instance = new SpotifyAuthManager();
    }
    return SpotifyAuthManager.instance;
  }

  private loadSpotifySDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Spotify) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = SPOTIFY_SDK_URL;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = (error) =>
        reject(new Error(`Failed to load Spotify SDK: ${error}`));

      document.body.appendChild(script);
    });
  }

  public async initializeSDK(): Promise<void> {
    try {
      await this.loadSpotifySDK();

      window.onSpotifyWebPlaybackSDKReady = () => {
        const options: SpotifyPlayerOptions = {
          name: "HIIT Timer Player",
          getOAuthToken: (callback) => {
            if (this.auth?.accessToken) {
              callback(this.auth.accessToken);
            }
          },
        };

        this.player = new window.Spotify.Player(options);

        // エラーハンドリング
        this.player.addListener("initialization_error", ({ message }) => {
          console.error("Failed to initialize player:", message);
        });

        this.player.addListener("authentication_error", ({ message }) => {
          console.error("Failed to authenticate:", message);
        });

        this.player.addListener("account_error", ({ message }) => {
          console.error("Failed to validate Spotify account:", message);
        });

        this.player.addListener("playback_error", ({ message }) => {
          console.error("Failed to perform playback:", message);
        });

        // 準備完了イベント
        this.player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
        });

        // 接続切れイベント
        this.player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID is not ready:", device_id);
        });

        // プレイヤーに接続
        this.player.connect();
      };
    } catch (error) {
      console.error("Failed to initialize Spotify SDK:", error);
      throw error;
    }
  }

  public getAuthUrl(): string {
    const scopes = [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-modify-playback-state",
      "user-read-playback-state",
    ];

    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "token",
      redirect_uri: REDIRECT_URI,
      scope: scopes.join(" "),
      show_dialog: "true",
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  public handleAuthCallback(hash: string): void {
    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const expiresIn = parseInt(params.get("expires_in") || "0", 10);

    if (accessToken) {
      this.auth = {
        accessToken,
        refreshToken: "", // Implicit Grantでは使用しない
        expiresIn,
        timestamp: Date.now(),
      };

      localStorage.setItem("spotify_auth", JSON.stringify(this.auth));
    }
  }

  public loadStoredAuth(): boolean {
    const stored = localStorage.getItem("spotify_auth");
    if (stored) {
      this.auth = JSON.parse(stored);
      return true;
    }
    return false;
  }

  public isAuthenticated(): boolean {
    if (!this.auth) return false;
    const now = Date.now();
    const expirationTime = this.auth.timestamp + this.auth.expiresIn * 1000;
    return now < expirationTime;
  }

  public getPlayer(): SpotifyPlayer | null {
    return this.player;
  }

  public clearAuth(): void {
    this.auth = null;
    localStorage.removeItem("spotify_auth");
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
  }
}
