import { useCallback } from 'react';
import type { Task, AppData } from '../utils/types';

type SetData = React.Dispatch<React.SetStateAction<AppData>>;

/**
 * Encapsulates all task CRUD mutations.
 * Receives the shared `setData` updater so tasks stay co-located with
 * the rest of the persisted state.
 */
export function useTasks(setData: SetData) {
  const addTask = useCallback(
    (title: string) => {
      const trimmed = title.trim();
      if (!trimmed) return;
      const task: Task = { id: crypto.randomUUID(), title: trimmed, isCompleted: false };
      setData(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
    },
    [setData]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
      }));
    },
    [setData]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
    },
    [setData]
  );

  return { addTask, toggleTask, deleteTask };
}
