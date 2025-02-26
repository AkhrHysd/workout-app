import { useEffect, useState } from "react";
import { SpotifyPlaybackState } from "../types/spotify";
import { SpotifyAuthManager } from "../utils/spotifyAuth";
import PremiumPlayer from "./players/PremiumPlayer";
import BasicPlayer from "./players/BasicPlayer";

interface SpotifyControllerProps {
  onPlaybackStateChange?: (state: SpotifyPlaybackState | null) => void;
  playlistUri?: string;
}

const SpotifyController: React.FC<SpotifyControllerProps> = ({
  onPlaybackStateChange,
  playlistUri,
}) => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const authManager = SpotifyAuthManager.getInstance();

    const initialize = async () => {
      try {
        // 保存された認証情報を読み込み
        const hasStoredAuth = authManager.loadStoredAuth();
        if (hasStoredAuth && authManager.isAuthenticated()) {
          setIsAuthenticated(true);
          await authManager.initializeSDK();

          // Premium判定
          const player = authManager.getPlayer();
          if (player) {
            player
              .getCurrentState()
              .then((state) => {
                // プレイヤーが正常に動作すればPremium会員
                setIsPremium(state !== null);
              })
              .catch(() => {
                setIsPremium(false);
              });
          } else {
            setIsPremium(false);
          }
        }
      } catch (error) {
        console.error("Failed to initialize Spotify:", error);
        setIsPremium(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  const handleLogin = () => {
    const authManager = SpotifyAuthManager.getInstance();
    window.location.href = authManager.getAuthUrl();
  };

  // 認証コールバックの処理
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const authManager = SpotifyAuthManager.getInstance();
      authManager.handleAuthCallback(hash);
      window.location.hash = "";
      setIsAuthenticated(true);
    }
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Spotifyと連携する</h3>
        <p className="text-gray-400 mb-4">
          音楽を再生するにはSpotifyアカウントとの連携が必要です
        </p>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
        >
          Spotifyにログイン
        </button>
      </div>
    );
  }

  // Premium判定が完了していない場合は基本プレイヤーを表示
  if (isPremium === null) {
    return <BasicPlayer playlistUri={playlistUri} />;
  }

  return isPremium ? (
    <PremiumPlayer onPlaybackStateChange={onPlaybackStateChange} />
  ) : (
    <BasicPlayer playlistUri={playlistUri} />
  );
};

export default SpotifyController;
