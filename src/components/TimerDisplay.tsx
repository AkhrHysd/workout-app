import { TimerDisplayProps } from "../types/workout";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  time,
  mode,
  currentSet,
  totalSets,
  exerciseTime,
  restTime,
}) => {
  const getModeText = () => {
    switch (mode) {
      case "preparing":
        return "準備";
      case "exercise":
        return "運動";
      case "rest":
        return "休憩";
      case "completed":
        return "完了";
      default:
        return "";
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case "preparing":
        return "text-yellow-500";
      case "exercise":
        return "text-red-500";
      case "rest":
        return "text-green-500";
      case "completed":
        return "text-blue-500";
      default:
        return "";
    }
  };

  const getProgressColor = () => {
    switch (mode) {
      case "preparing":
        return "stroke-yellow-500";
      case "exercise":
        return "stroke-red-500";
      case "rest":
        return "stroke-green-500";
      case "completed":
        return "stroke-blue-500";
      default:
        return "";
    }
  };

  // サークルの半径と円周
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  // 進捗に基づいてストロークの長さを計算
  const getProgress = () => {
    const getTotalTime = () => {
      switch (mode) {
        case "preparing":
          return 10; // 準備時間は固定
        case "exercise":
          return totalSets > currentSet ? exerciseTime : time; // 最後のセットは残り時間を使用
        case "rest":
          return restTime;
        default:
          return 0;
      }
    };

    if (mode === "completed") return circumference;
    const totalTime = getTotalTime();
    return ((totalTime - time) / totalTime) * circumference;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-72 h-72">
        {/* ベースとなる円 */}
        <svg className="w-full h-full -rotate-90 transform">
          <circle
            cx="144"
            cy="144"
            r={radius}
            className="fill-none stroke-gray-700"
            strokeWidth="12"
          />
          {/* プログレス円 */}
          <circle
            cx="144"
            cy="144"
            r={radius}
            className={`fill-none ${getProgressColor()} transition-all duration-1000 ease-linear`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={getProgress()}
            strokeLinecap="round"
          />
        </svg>
        {/* 中央のタイマー表示 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-6xl font-bold mb-2">{formatTime(time)}</div>
          <div className={`text-3xl font-semibold ${getModeColor()}`}>
            {getModeText()}
          </div>
        </div>
      </div>
      <div className="text-xl text-gray-300">
        セット: {currentSet} / {totalSets}
      </div>
    </div>
  );
};

export default TimerDisplay;
