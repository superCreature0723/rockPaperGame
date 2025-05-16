"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please log in.");
        router.push("/login");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-200">
      <h1 className="text-4xl font-bold mb-6 text-yellow-900">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        {error && <p className="text-red-600">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="p-2 rounded border"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded border"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded border"
        />
        <button
          type="submit"
          className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </main>
  );
}
