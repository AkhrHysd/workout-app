import { useState } from "react";

interface BasicPlayerProps {
  playlistUri?: string;
}

const BasicPlayer: React.FC<BasicPlayerProps> = ({
  playlistUri = "spotify:playlist:37i9dQZF1DX76Wlfdnj7AP", // デフォルトのワークアウトプレイリスト
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URIからIDを抽出
  const getPlaylistId = (uri: string): string => {
    const parts = uri.split(":");
    return parts[parts.length - 1];
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError("プレイヤーの読み込みに失敗しました");
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 p-4 text-center">
          <p>エラーが発生しました</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <iframe
        src={`https://open.spotify.com/embed/playlist/${getPlaylistId(
          playlistUri
        )}`}
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
        className={`rounded-lg ${isLoading ? "hidden" : "block"}`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />

      <p className="text-sm text-gray-400 mt-2 text-center">
        ※ プレミアム会員の場合、より高度な音楽制御が可能です
      </p>
    </div>
  );
};

export default BasicPlayer;
