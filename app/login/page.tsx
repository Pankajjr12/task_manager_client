"use client";

import { useState } from "react";
import API from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
  
      console.log("LOGIN RESPONSE:", res.data);
  
      login(res.data.accessToken, res.data.userId);
  
      toast.success("Login successful");
  
      router.push("/");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
  
      toast.error(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded w-80">
        <h2>Login</h2>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}