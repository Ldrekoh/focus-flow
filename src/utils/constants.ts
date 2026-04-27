import type { AppData, TimerMode } from './types';

export const STORAGE_KEY = 'focus-flow-v2';

export const DEFAULT_DATA: AppData = {
  settings: {
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    sessionsBeforeLongBreak: 4,
  },
  tasks: [],
};

export const MODE_LABELS: Record<TimerMode, string> = {
  WORK: '🎯 Travail',
  BREAK: '☕ Pause',
  LONG_BREAK: '🍹 Pause longue',
};

export type ChimeType = 'work' | 'break';

export const MODE_NOTIF: Record<TimerMode, { body: string; chime: ChimeType }> = {
  WORK: { body: "C'est l'heure d'une pause !", chime: 'work' },
  BREAK: { body: "On s'y remet ?", chime: 'break' },
  LONG_BREAK: { body: "On s'y remet ?", chime: 'break' },
};
