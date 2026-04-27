import { useRef } from 'react';
import type { Task } from '../utils/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onAdd, onToggle, onDelete }: TaskListProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    onAdd(e.currentTarget.value);
    e.currentTarget.value = '';
  };

  return (
    <div className="w-full max-w-md px-6">
      <input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Quoi de neuf aujourd'hui ?"
        className="w-full p-5 rounded-2xl border-none shadow-lg focus:ring-4 focus:ring-indigo-100 transition-all text-gray-700 mb-6 outline-none"
      />
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
