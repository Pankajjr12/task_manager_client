"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 10;

  // ✅ use token (not localStorage mismatch)
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // ✅ fetch tasks (safe + correct endpoint)
  const fetchTasks = async () => {
    try {
      let url = `${API_URL}/tasks?page=${page}&limit=${limit}&search=${search}`;

      if (filter !== "all") {
        url += `&status=${filter === "completed"}`;
      }

      const res = await fetch(url, { headers: getHeaders() });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();

      setTasks(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchTasks();
  }, [token, page, search, filter]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  // ✅ CREATE
  const addTask = async (task: any) => {
    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UPDATE
  const updateTask = async (id: string, task: any) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ TOGGLE
  const toggleTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 mb-3 w-full"
      />

      {/* 🔽 Filter */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => handleFilter("all")} className="border px-2">
          All
        </button>

        <button
          onClick={() => handleFilter("completed")}
          className="border px-2"
        >
          Completed
        </button>

        <button onClick={() => handleFilter("pending")} className="border px-2">
          Pending
        </button>
      </div>

      {/* ➕ Add Task */}
      <button
        onClick={() => {
          setEditTask(null);
          setOpen(true);
        }}
        className="mb-4 bg-green-500 text-white px-3 py-1 rounded"
      >
        + Add Task
      </button>

      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        onAdd={addTask}
        onUpdate={updateTask}
        editTask={editTask}
      />

      {/* 📋 Task List */}
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={(task: any) => {
            setEditTask(task);
            setOpen(true);
          }}
        />
      ))}

      {tasks.length === 0 && (
        <p className="text-gray-500">No tasks found</p>
      )}

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border"
        >
          Prev
        </button>

        <span className="font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border"
        >
          Next
        </button>
      </div>
    </div>
  );
}