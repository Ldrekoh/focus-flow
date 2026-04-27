import { DEFAULT_DATA, STORAGE_KEY } from './constants';
import type { AppData } from './types';

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    // corrupted storage — fall through to default
  }
  return DEFAULT_DATA;
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('[focus-flow] Failed to persist data to localStorage.');
  }
}

export function exportJSON(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `focus-flow-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(raw: string): AppData | null {
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    if (parsed.settings && Array.isArray(parsed.tasks)) {
      return parsed as AppData;
    }
    return null;
  } catch {
    return null;
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
