import { useEffect, useState, useCallback } from "react";
import TimerDisplay from "../components/TimerDisplay";
import WorkoutControls from "../components/WorkoutControls";
import SettingsForm from "../components/SettingsForm";
import { WorkoutSettings } from "../types/workout";
import { spotifyPlayer } from "../utils/spotifyPlayer";

const STORAGE_KEY = "workout_settings";
const PREPARATION_TIME = 10; // 準備時間（秒）

const WorkoutContainer: React.FC = () => {
  const [settings, setSettings] = useState<WorkoutSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          exerciseTime: 30,
          restTime: 10,
          sets: 3,
          currentSet: 1,
          isRunning: false,
          isPaused: false,
          mode: "preparing" as const,
        };
  });

  const [timeLeft, setTimeLeft] = useState(PREPARATION_TIME);
  const [timerId, setTimerId] = useState<number | null>(null);

  const saveSettings = useCallback(
    (newSettings: Partial<WorkoutSettings>) => {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));

      // フェーズ変更時の音量調整
      if (newSettings.mode) {
        spotifyPlayer.setVolumeForPhase(newSettings.mode);
      }
    },
    [settings]
  );

  const resetWorkout = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setTimeLeft(PREPARATION_TIME);
    saveSettings({
      currentSet: 1,
      isRunning: false,
      isPaused: false,
      mode: "preparing",
    });
  }, [timerId, saveSettings]);

  const handleStart = useCallback(() => {
    if (!settings.isRunning || settings.isPaused) {
      if (settings.mode === "preparing") {
        setTimeLeft(PREPARATION_TIME);
      }
      saveSettings({ isRunning: true, isPaused: false });
      spotifyPlayer.playCountdownSequence(3);
    }
  }, [settings.isRunning, settings.isPaused, settings.mode, saveSettings]);

  const handlePause = useCallback(() => {
    saveSettings({ isPaused: true });
    spotifyPlayer.pause();
  }, [saveSettings]);

  const handleSettingsSubmit = useCallback(
    (
      newSettings: Omit<
        WorkoutSettings,
        "currentSet" | "isRunning" | "isPaused" | "mode"
      >
    ) => {
      resetWorkout();
      saveSettings(newSettings);
    },
    [resetWorkout, saveSettings]
  );

  useEffect(() => {
    if (settings.isRunning && !settings.isPaused) {
      const id = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (settings.mode === "preparing") {
              spotifyPlayer.playCountdownSequence(3).then(() => {
                spotifyPlayer.play();
              });
              saveSettings({ mode: "exercise" });
              return settings.exerciseTime;
            } else if (settings.mode === "exercise") {
              if (settings.currentSet < settings.sets) {
                spotifyPlayer.playCountdownSequence(3);
                saveSettings({ mode: "rest" });
                return settings.restTime;
              } else {
                spotifyPlayer.playCountdownSequence(3);
                saveSettings({ mode: "completed", isRunning: false });
                return 0;
              }
            } else if (settings.mode === "rest") {
              spotifyPlayer.playCountdownSequence(3);
              saveSettings({
                mode: "exercise",
                currentSet: settings.currentSet + 1,
              });
              return settings.exerciseTime;
            }
          }
          return prev - 1;
        });
      }, 1000);
      setTimerId(id);
      return () => clearInterval(id);
    }
  }, [
    settings.isRunning,
    settings.isPaused,
    settings.mode,
    settings.currentSet,
    settings.sets,
    settings.exerciseTime,
    settings.restTime,
    saveSettings,
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">HIIT Timer</h1>
      <div className="grid gap-8">
        <TimerDisplay
          time={timeLeft}
          mode={settings.mode}
          currentSet={settings.currentSet}
          totalSets={settings.sets}
          exerciseTime={settings.exerciseTime}
          restTime={settings.restTime}
        />
        <WorkoutControls
          onStart={handleStart}
          onPause={handlePause}
          onReset={resetWorkout}
          isRunning={settings.isRunning}
          isPaused={settings.isPaused}
        />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">設定</h2>
          <SettingsForm
            settings={{
              exerciseTime: settings.exerciseTime,
              restTime: settings.restTime,
              sets: settings.sets,
            }}
            onSubmit={handleSettingsSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkoutContainer;
