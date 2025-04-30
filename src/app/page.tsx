"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define types for Room and GameHistory
interface Room {
  id: number;
  name: string;
  status: string;
  players: number;
  maxPlayers: number;
}

interface GameHistory {
  roomName: string;
  winner: string;
  timestamp: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  useEffect(() => {
    // Simulating fetching room data from an API or backend.
    // You can replace this with actual data fetching or real-time updates.

    const fetchRoomData = async () => {
      const roomData: Room[] = [
        { id: 1, name: "Room 1", status: "Waiting", players: 1, maxPlayers: 2 },
        { id: 2, name: "Room 2", status: "Full", players: 2, maxPlayers: 2 },
        { id: 3, name: "Room 3", status: "Waiting", players: 1, maxPlayers: 2 },
      ];
      setRooms(roomData);
    };

    // Simulate game history data
    const historyData: GameHistory[] = [
      {
        roomName: "Room 1",
        winner: "Player 1",
        timestamp: "2025-04-30 12:00:00",
      },
      {
        roomName: "Room 2",
        winner: "Player 2",
        timestamp: "2025-04-30 14:00:00",
      },
    ];
    setGameHistory(historyData);

    fetchRoomData();
  }, []);

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
      <h1 className="text-4xl font-bold text-yellow-900 mb-8">
        Welcome To Rock Paper Scissors
      </h1>

      {/* Adjusted positioning of Raptor link to top-right */}
      <div className="flex justify-end w-full max-w-4xl mb-8">
        <Link
          href="/profile"
          className="text-2xl font-light uppercase underline underline-offset-8 text-red-900"
        >
          Raptor
        </Link>
      </div>

      {/* Room Section */}
      <div className="flex gap-8 mb-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex flex-col items-center p-6 border-2 border-black rounded-xl w-1/3"
          >
            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-500 mb-4">
              {room.players}/{room.maxPlayers} players - {room.status}
            </p>
            <Link
              href={`/game`}
              className="px-4 py-2 border-2 border-black rounded-xl text-center text-gray-800 font-medium"
            >
              Join
            </Link>
          </div>
        ))}
      </div>

      {/* Done Section - Game History Table */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-4">
          Game History
        </h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-gray-500 px-4 py-2 text-left">
                Room
              </th>
              <th className="border-2 border-gray-500 px-4 py-2 text-left">
                Winner
              </th>
              <th className="border-2 border-gray-500 px-4 py-2 text-left">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {gameHistory.map((game, index) => (
              <tr key={index} className="bg-white">
                <td className="border-2 border-gray-500 px-4 py-2">
                  {game.roomName}
                </td>
                <td className="border-2 border-gray-500 px-4 py-2">
                  {game.winner}
                </td>
                <td className="border-2 border-gray-500 px-4 py-2">
                  {game.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
