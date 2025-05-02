"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use Next.js navigation hooks

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Handle form submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (username) {
      // Store username in local storage or state
      localStorage.setItem("playerName", username);

      // Redirect to the main game page (or the lobby page)
      router.push("/"); // Redirecting to the home page or game lobby
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
          type="text"
          id="username"
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
