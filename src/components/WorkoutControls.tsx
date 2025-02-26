import { WorkoutControlsProps } from "../types/workout";

const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  onStart,
  onPause,
  onReset,
  isRunning,
  isPaused,
}) => {
  const buttonBaseClass =
    "px-6 py-2 rounded-lg font-semibold text-white transition-colors duration-200";

  return (
    <div className="flex justify-center space-x-4 mt-8">
      {!isRunning || isPaused ? (
        <button
          onClick={onStart}
          className={`${buttonBaseClass} bg-green-600 hover:bg-green-700`}
        >
          {isPaused ? "再開" : "開始"}
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`${buttonBaseClass} bg-yellow-600 hover:bg-yellow-700`}
        >
          一時停止
        </button>
      )}
      <button
        onClick={onReset}
        className={`${buttonBaseClass} bg-red-600 hover:bg-red-700`}
      >
        リセット
      </button>
    </div>
  );
};

export default WorkoutControls;
