"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RoomInfo from "./components/lobby/RoomInfo";
import HistoryTable from "./components/lobby/HistoryTable";
import { useRouter } from "next/navigation";

interface Room {
  id: number;
  name: string;
  status: string;
  players: { id: number; name: string }[];
  maxPlayers: number;
  currentPlayers: number;
}

interface GameHistory {
  roomName: string;
  winner: string;
  timestamp: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
      router.push("/login"); // Redirect to login page if no username is found
    } else {
      setUsername(playerName);
    }

    const fetchGameData = async () => {
      const response = await fetch("/api/gameData");
      const data = await response.json();
      setRooms(data.rooms);
      setGameHistory(data.gameHistory);
    };

    fetchGameData();
  }, []);

  return (
    <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
      <h1 className="text-4xl font-bold text-yellow-900 mb-8">
        Welcome To Rock Paper Scissors
      </h1>

      <div className="flex justify-between w-full max-w-4xl mb-8">
        <div className="flex justify-start">
          <Link
            href="/create-room"
            className="inline-flex items-center justify-center w-48 py-2 bg-green-500 text-white rounded-lg"
          >
            Create Game Room
          </Link>
        </div>

        <div className="flex justify-end w-full">
          <Link
            href="/login"
            className="text-2xl font-light uppercase underline underline-offset-8 text-red-900"
          >
            {username}
          </Link>
        </div>
      </div>

      <div className="flex gap-8 mb-8">
        {rooms !== undefined &&
          rooms.map((room) => <RoomInfo key={room.id} room={room} />)}
      </div>

      <HistoryTable gameHistory={gameHistory} />
    </main>
  );
}
