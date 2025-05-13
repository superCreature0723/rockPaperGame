// src/app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username) {
      const response = await fetch("/api/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("playerName", username);
        router.push("/");
      } else {
        alert(data.error || "User not found. Please sign up.");
        router.push("/signup");
      }
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/signup");
  };

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
      <h1 className="text-4xl font-bold text-yellow-900 mb-8">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label htmlFor="username" className="text-lg font-medium text-gray-800">
          Enter your name:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter your username"
          required
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start Game
        </button>
        <button
          onClick={handleSignup}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
