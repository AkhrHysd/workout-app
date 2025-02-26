export interface SpotifyPlayer {
  _options: {
    getOAuthToken: (callback: (token: string) => void) => void;
    name: string;
    volume: number;
  };
  connect: () => Promise<boolean>;
  disconnect: () => void;
  addListener: (
    event: SpotifyPlayerEvent,
    callback: (state: SpotifyEventState) => void
  ) => void;
  removeListener: (
    event: SpotifyPlayerEvent,
    callback: (state: SpotifyEventState) => void
  ) => void;
  getCurrentState: () => Promise<SpotifyPlaybackState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
}

export type SpotifyPlayerEvent =
  | "ready"
  | "not_ready"
  | "player_state_changed"
  | "initialization_error"
  | "authentication_error"
  | "account_error"
  | "playback_error";

export interface SpotifyEventState {
  device_id?: string;
  message?: string;
}

export interface SpotifyPlaybackState {
  context: {
    uri: string;
    metadata: Record<string, unknown>;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyTrack;
    previous_tracks: SpotifyTrack[];
    next_tracks: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  album: {
    name: string;
    uri: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{
    name: string;
    uri: string;
  }>;
  duration_ms: number;
  id: string;
  is_playable: boolean;
  name: string;
  uri: string;
}

export interface SpotifyAuth {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  timestamp: number;
}

export interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
  }
}
