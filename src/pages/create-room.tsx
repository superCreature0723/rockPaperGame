"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(2);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomData = {
      name: roomName,
      status: "Waiting",
      players: [],
      maxPlayers: maxPlayers,
      currentPlayers: 0,
      history: [],
    };
    console.log("Raptor - Room Data:", roomData); // Log the room data for debugging

    // Send a request to the API to create a new room
    const response = await fetch("/api/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });
    console.log("Raptor - Response:", response); // Log the response for debugging

    const data = await response.json();

    if (response.ok) {
      router.push("/"); // Redirect back to the lobby page after creating the room
    } else {
      alert("Error creating room: " + data.error);
    }
  };

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
      <h1 className="text-4xl font-bold text-yellow-900 mb-8">
        Create Game Room
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="roomName" className="text-lg font-medium text-gray-800">
          Room Name:
        </label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Enter room name"
          required
        />

        <label
          htmlFor="maxPlayers"
          className="text-lg font-medium text-gray-800"
        >
          Max Players:
        </label>
        <input
          type="number"
          id="maxPlayers"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
          min={2}
          className="px-4 py-2 border border-gray-300 rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-48 py-2 bg-green-500 text-white rounded-lg mt-4"
        >
          Create Room
        </button>
      </form>
    </main>
  );
};

export default CreateRoom;
