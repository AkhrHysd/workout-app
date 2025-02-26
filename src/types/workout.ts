export interface WorkoutSettings {
  exerciseTime: number; // 運動時間（秒）
  restTime: number; // 休憩時間（秒）
  sets: number; // セット数
  currentSet: number; // 現在のセット
  isRunning: boolean; // タイマー実行中かどうか
  isPaused: boolean; // 一時停止中かどうか
  mode: "preparing" | "exercise" | "rest" | "completed"; // 現在のモード
}

export interface TimerDisplayProps {
  time: number;
  mode: WorkoutSettings["mode"];
  currentSet: number;
  totalSets: number;
  exerciseTime: number;
  restTime: number;
}

export interface WorkoutControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

export interface SettingsFormProps {
  settings: Omit<
    WorkoutSettings,
    "currentSet" | "isRunning" | "isPaused" | "mode"
  >;
  onSubmit: (
    settings: Omit<
      WorkoutSettings,
      "currentSet" | "isRunning" | "isPaused" | "mode"
    >
  ) => void;
}
