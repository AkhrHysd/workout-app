# HIIT Timer with Spotify Integration - Implementation Plan

## 概要

HIIT タイマーアプリケーションに Spotify Web Playback SDK を統合し、プレミアム会員向けの高度な音楽制御機能を実装する。

## 実装フェーズ

### フェーズ 1: Spotify SDK 基盤実装

#### 必要なパッケージ

```bash
npm install @spotify/web-playback-sdk-types
npm install @spotify/web-api-node
```

#### コンポーネント構成

- SpotifyAuthManager: 認証管理
- SpotifyPlayerManager: プレイヤー制御
- TokenManager: トークン管理

#### 主要クラス

```typescript
// src/utils/spotify.ts
class SpotifyAuthManager {
  initializeSDK(): Promise<void>;
  handleAuth(): Promise<void>;
  refreshToken(): Promise<void>;
}

// src/utils/spotifyPlayer.ts
class SpotifyPlayerManager {
  initialize(): Promise<void>;
  play(): Promise<void>;
  adjustVolume(level: number): Promise<void>;
}
```

### フェーズ 2: 音声制御システム

#### コンポーネント構成

- AudioMixer: 音声ミキシング
- SyncController: 同期制御
- VolumeManager: 音量管理

#### 主要クラス

```typescript
// src/utils/audioMixer.ts
class AudioMixer {
  setMusicVolume(level: number): void;
  setCountdownVolume(level: number): void;
  fadeMusic(from: number, to: number, duration: number): Promise<void>;
}

// src/utils/syncController.ts
class SyncController {
  startWorkout(): Promise<void>;
  handlePhaseTransition(phase: WorkoutPhase): void;
}
```

### フェーズ 3: UI 実装

#### コンポーネント構成

- SpotifyController: メインコントローラー
- PremiumPlayer: プレミアム向けプレイヤー
- BasicPlayer: 非プレミアム向けプレイヤー

#### 主要コンポーネント

```typescript
// src/components/SpotifyController.tsx
const SpotifyController: React.FC = () => {
  // Premium判定
  // プレイヤー切り替え
  // 状態管理
};

// src/components/players/PremiumPlayer.tsx
const PremiumPlayer: React.FC = () => {
  // SDK制御
  // 詳細な再生制御
};

// src/components/players/BasicPlayer.tsx
const BasicPlayer: React.FC = () => {
  // iframe埋め込み
  // 基本的な表示
};
```

## 音声制御仕様

### 音量制御パターン

1. 準備時間（10 秒）

   - 音楽: 70%
   - カウントダウン: 100%

2. 運動中

   - 通常時: 85%
   - カウントダウン時: 60%（一時的に）

3. 休憩中
   - 通常時: 100%
   - カウントダウン時: 70%（一時的に）

### 同期制御フロー

1. 開始ボタン押下
2. カウントダウン開始（3 秒）
3. カウントダウン終了と同時に：
   - 開始音再生
   - 音楽再生開始
   - 運動開始

## エラーハンドリング

### 想定されるエラー

1. 認証エラー
   - トークン期限切れ
   - 認証失敗
2. 接続エラー
   - ネットワーク切断
   - SDK ロード失敗
3. プレミアム判定エラー
   - 非プレミアム会員
   - 判定失敗

### エラー時の動作

1. 認証エラー
   - 自動再認証
   - フォールバックモードへの切り替え
2. 接続エラー
   - 再接続試行
   - オフラインモードへの切り替え
3. プレミアム判定エラー
   - 基本プレイヤーへの自動切り替え
   - エラーメッセージ表示

## 必要な環境変数

```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_SPOTIFY_REDIRECT_URI=your_redirect_uri
```

## 開発フロー

1. 環境構築

   - パッケージインストール
   - 環境変数設定
   - TypeScript 設定

2. 基盤実装

   - 認証システム
   - プレイヤー制御
   - 状態管理

3. 機能実装

   - 音声制御
   - 同期システム
   - UI 実装

4. テスト

   - 単体テスト
   - 結合テスト
   - E2E テスト

5. デプロイ
   - ビルド
   - 環境変数設定
   - デプロイ
