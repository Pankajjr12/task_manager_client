"use client";

import { useEffect, useState } from "react";
import API from "../lib/api";
import { Task } from "../types/task";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks?search=${search}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search]);

  return { tasks, fetchTasks, search, setSearch };
};