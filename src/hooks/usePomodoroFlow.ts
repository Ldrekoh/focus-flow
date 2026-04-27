import { useState, useRef, useEffect, useCallback } from 'react';
import { useTimer } from './useTimer';
import { useNotification } from './useNotification';
import { MODE_NOTIF } from '../utils/constants';
import type { AppSettings, TimerMode } from '../utils/types';

interface UsePomodoroFlowReturn {
  mode: TimerMode;
  secondsLeft: number;
  isActive: boolean;
  completedSessions: number;
  dotsState: boolean[];
  toggle: () => void;
  manualReset: () => void;
  fullReset: () => void;
  applySettings: (s: AppSettings) => void;
}

export function usePomodoroFlow(initialSettings: AppSettings): UsePomodoroFlowReturn {
  const [mode, setMode] = useState<TimerMode>('WORK');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  const modeRef = useRef(mode);
  const completedRef = useRef(completedSessions);
  const settingsRef = useRef(settings);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    completedRef.current = completedSessions;
  }, [completedSessions]);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const { notify } = useNotification();

  const resetRef = useRef<(newSeconds: number, autoStart?: boolean) => void>(() => {});

  const handleFinished = useCallback(() => {
    const s = settingsRef.current;
    const cur = modeRef.current;
    const done = completedRef.current;

    const { body, chime } = MODE_NOTIF[cur];
    notify('Focus Flow', body, chime);

    if (cur === 'WORK') {
      const next = done + 1;
      setCompletedSessions(next);
      if (next % s.sessionsBeforeLongBreak === 0) {
        setMode('LONG_BREAK');
        resetRef.current(s.longBreakDuration, true);
      } else {
        setMode('BREAK');
        resetRef.current(s.breakDuration, true);
      }
    } else {
      setMode('WORK');
      resetRef.current(s.workDuration, true);
    }
  }, [notify]);

  const { secondsLeft, isActive, toggle, reset } = useTimer(
    initialSettings.workDuration,
    handleFinished
  );

  resetRef.current = reset;

  // Remet le timer au temps du mode courant, stoppe tout.
  const manualReset = useCallback(() => {
    const s = settingsRef.current;
    const cur = modeRef.current;
    const t =
      cur === 'WORK' ? s.workDuration : cur === 'BREAK' ? s.breakDuration : s.longBreakDuration;
    reset(t, false);
  }, [reset]);

  // Remet tout à zéro : mode WORK, sessions à 0, timer au début.
  const fullReset = useCallback(() => {
    setMode('WORK');
    setCompletedSessions(0);
    // modeRef mis à jour de façon synchrone pour que reset utilise workDuration
    modeRef.current = 'WORK';
    reset(settingsRef.current.workDuration, false);
  }, [reset]);

  const applySettings = useCallback(
    (newSettings: AppSettings) => {
      setSettings(newSettings);
      const cur = modeRef.current;
      const t =
        cur === 'WORK'
          ? newSettings.workDuration
          : cur === 'BREAK'
            ? newSettings.breakDuration
            : newSettings.longBreakDuration;
      reset(t, false);
    },
    [reset]
  );

  const cycles = settings.sessionsBeforeLongBreak;
  const doneInCycle = completedSessions % cycles;
  const dotsState = Array.from({ length: cycles }, (_, i) => i < doneInCycle);

  return {
    mode,
    secondsLeft,
    isActive,
    completedSessions,
    dotsState,
    toggle,
    manualReset,
    fullReset,
    applySettings,
  };
}
