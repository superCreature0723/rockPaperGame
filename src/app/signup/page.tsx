"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation hooks

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username && email) {
      const response = await fetch("/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("playerName", username);
        router.push("/");
      } else {
        alert(data.error || "Error saving user data.");
      }
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
      <h1 className="text-4xl font-bold text-yellow-900 mb-8">Sign up</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <label htmlFor="username" className="text-lg font-medium text-gray-800">
          Enter your username:
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

        <label htmlFor="Email" className="text-lg font-medium text-gray-800">
          Enter your Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter your Email"
          required
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
