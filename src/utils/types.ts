export type TimerMode = 'WORK' | 'BREAK' | 'LONG_BREAK';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface AppSettings {
  workDuration: number; // in seconds
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

export interface AppData {
  settings: AppSettings;
  tasks: Task[];
}
