"use client";

import { useAuth } from "@/hooks/useAuth";

export default function TaskItem({ task, onToggle, onDelete, onEdit }: any) {
  const { userId } = useAuth();

  const isOwner = String(task.userId) === String(userId);

  return (
    <div className="p-4 border rounded flex justify-between mb-2">
      <div>
        <h3
          className={
            task.completed ? "line-through font-semibold" : "font-semibold"
          }
        >
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
      </div>

      {isOwner ? (
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />

          <button onClick={() => onEdit(task)} className="text-blue-500">
            Edit
          </button>

          <button onClick={() => onDelete(task.id)} className="text-red-500">
            Delete
          </button>
        </div>
      ) : (
        <span className="text-gray-400">Read only</span>
      )}
    </div>
  );
}
