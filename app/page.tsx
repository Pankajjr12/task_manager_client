"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";

const API_URL = "http://localhost:5000/tasks";

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

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

  const fetchTasks = async () => {
    let url = `${API_URL}?page=${page}&limit=${limit}&search=${search}`;

    if (filter !== "all") {
      url += `&status=${filter === "completed"}`;
    }

    const res = await fetch(url, { headers: getHeaders() });
    const data = await res.json();

    if (data?.error) {
      router.push("/login");
      return;
    }

    setTasks(data.data);
    setTotalPages(data.totalPages);
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

  //  crud here
  const addTask = async (task: any) => {
    await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    fetchTasks();
  };

  const updateTask = async (id: string, task: any) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(task),
    });
    fetchTasks();
  };

  const toggleTask = async (id: string) => {
    await fetch(`${API_URL}/${id}/toggle`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    fetchTasks();
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 mb-3 w-full"
      />

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

      {tasks.length === 0 && <p className="text-gray-500">No tasks found</p>}

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
