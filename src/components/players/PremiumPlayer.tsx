import { useEffect, useState } from "react";
import { SpotifyPlaybackState } from "../../types/spotify";
import { SpotifyPlayerManager } from "../../utils/spotifyPlayer";

interface PremiumPlayerProps {
  onPlaybackStateChange?: (state: SpotifyPlaybackState | null) => void;
}

const PremiumPlayer: React.FC<PremiumPlayerProps> = ({
  onPlaybackStateChange,
}) => {
  const [playbackState, setPlaybackState] =
    useState<SpotifyPlaybackState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const playerManager = SpotifyPlayerManager.getInstance();

    const initializePlayer = async () => {
      try {
        setIsLoading(true);
        playerManager.initialize();
        const state = await playerManager.getCurrentState();
        setPlaybackState(state);
        if (onPlaybackStateChange) {
          onPlaybackStateChange(state);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize player"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializePlayer();

    return () => {
      playerManager.disconnect();
    };
  }, [onPlaybackStateChange]);

  const handlePlayPause = async () => {
    try {
      const playerManager = SpotifyPlayerManager.getInstance();
      await playerManager.togglePlayPause();
      const newState = await playerManager.getCurrentState();
      setPlaybackState(newState);
      if (onPlaybackStateChange) {
        onPlaybackStateChange(newState);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle playback"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>エラーが発生しました</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const currentTrack = playbackState?.track_window.current_track;

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      {currentTrack ? (
        <div className="flex items-center space-x-4">
          {currentTrack.album.images[0] && (
            <img
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              className="w-16 h-16 rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {currentTrack.name}
            </p>
            <p className="text-gray-400 text-sm truncate">
              {currentTrack.artists.map((a) => a.name).join(", ")}
            </p>
          </div>
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {playbackState?.paused ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              )}
            </svg>
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>再生中の曲はありません</p>
        </div>
      )}
    </div>
  );
};

export default PremiumPlayer;
