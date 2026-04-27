import type { Task } from '../utils/types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className="group flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onToggle(task.id)}
          className="w-5 h-5 rounded-lg border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
        <span
          className={`font-medium ${
            task.isCompleted ? 'line-through text-gray-300' : 'text-gray-600'
          }`}
        >
          {task.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-rose-500 transition-all"
        aria-label="Supprimer la tâche"
      >
        ✕
      </button>
    </div>
  );
}
