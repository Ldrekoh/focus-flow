import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerReturn {
  secondsLeft: number;
  isActive: boolean;
  toggle: () => void;
  reset: (newSeconds: number, autoStart?: boolean) => void;
}

/**
 * Core countdown timer.
 *
 * Key design decisions:
 * - `onFinished` is stored in a ref so callers can pass an inline callback
 *   without triggering the effect (no stale-closure bug).
 * - `reset` is stable (useCallback with no deps) — safe to call inside
 *   other callbacks without being listed as a dependency.
 * - The tick effect only depends on `isActive`; state reads happen inside
 *   the setter function to avoid capturing stale values.
 */
export function useTimer(initialSeconds: number, onFinished: () => void): UseTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Always up-to-date reference — no stale closure on the callback.
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  const clearTick = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => setIsActive(prev => !prev), []);

  const reset = useCallback(
    (newSeconds: number, autoStart = false) => {
      clearTick();
      setSecondsLeft(newSeconds);
      setIsActive(autoStart);
    },
    [clearTick]
  );

  useEffect(() => {
    if (!isActive) {
      clearTick();
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearTick();
          setIsActive(false);
          // Defer so React finishes this state batch before the callback
          // triggers another state update.
          setTimeout(() => onFinishedRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTick;
  }, [isActive, clearTick]);

  return { secondsLeft, isActive, toggle, reset };
}
