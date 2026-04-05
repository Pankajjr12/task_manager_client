"use client";

import { useEffect, useState } from "react";

export default function TaskForm({
  open,
  onClose,
  onAdd,
  onUpdate,
  editTask,
}: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setCompleted(editTask.completed || false);
    } else {
      setTitle("");
      setDescription("");
      setCompleted(false);
    }
  }, [editTask]);

  if (!open) return null;

  const submit = () => {
    if (!title) return;

    const payload = { title, description, completed };

    if (editTask) {
      onUpdate(editTask.id, payload);
    } else {
      onAdd(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-4 w-80 rounded">
        <h2 className="text-lg mb-2">{editTask ? "Edit Task" : "Add Task"}</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed
        </label>

        <div className="flex justify-between">
          <button
            onClick={submit}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>

          <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
