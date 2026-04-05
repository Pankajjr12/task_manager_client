"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <h2 className="font-bold text-lg">Task Manager</h2>

      {token ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{user?.email}</span>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="bg-green-500 px-3 py-1 rounded"
          >
            Register
          </button>
        </div>
      )}
    </div>
  );
}
