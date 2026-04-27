import { useEffect, useCallback } from 'react';
import type { ChimeType } from '../utils/constants';

function createChime(ctx: AudioContext, frequency: number, duration: number): void {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.value = frequency;
  osc2.frequency.value = frequency * 1.007;

  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + duration);
  osc2.stop(ctx.currentTime + duration);
}

function playChime(type: ChimeType): void {
  try {
    const ctx = new AudioContext();
    const [note1, note2] =
      type === 'work'
        ? [523.25, 659.25] // C5 → E5  ascending  (pause incoming)
        : [659.25, 523.25]; // E5 → C5  descending  (back to work)

    createChime(ctx, note1, 1.2);
    setTimeout(() => createChime(ctx, note2, 1.4), 280);
    setTimeout(() => ctx.close(), 2000);
  } catch {
    // AudioContext unavailable — silent fail
  }
}

export function useNotification() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const notify = useCallback((title: string, body: string, chime: ChimeType) => {
    playChime(chime);
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: '/vite.svg' });
  }, []);

  return { notify };
}
