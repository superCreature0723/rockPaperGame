"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RoomInfo from "./components/lobby/RoomInfo";
import HistoryTable from "./components/lobby/HistoryTable";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setRoom, setSockets } from "./redux/socket/socket.slice";
import { setIsPlaying } from "./redux/players/online-players.slice";
import { io } from "socket.io-client";

export const socket = io(
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_SERVER_URL}`
    : "http://localhost:5000"
);

interface Room {
  _id: string;
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
      router.push("/login");
      return;
    }
    setUsername(playerName);

    socket.emit("user-login", playerName);

    socket.on("user-login", (newUser: string) => {
      // you could update a user list in redux here
    });

    socket.on("updated-users", (users: string[]) => {
      dispatch(setSockets(users));
    });

    // fetch rooms from backend (or better, dispatch an action that fetches rooms)
    fetchRooms();

    return () => {
      socket.off("user-login");
      socket.off("updated-users");
    };
  }, [router, dispatch]);


  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-rooms"); // Make sure the backend URL is correct
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms); // Set the rooms data from backend
        console.log("Rooms fetched successfully:", data.rooms);
      } else {
        console.error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  
  const handleLogout = () => {
    localStorage.removeItem("playerName"); // Remove stored username
    router.push("/login"); // Redirect to login page
  };

  const handleJoinRoom = async (roomId: number) => {
    const playerName = localStorage.getItem("playerName");

    if (!playerName) {
      router.push("/login");
      return;
    }

    const roomData = {
      roomId,
      playerName,
    };

    const response = await fetch("/api/join-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/game"); // Redirect to the game page once joined
    } else {
      alert("Error joining room: " + data.message);
    }
  };

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
          {username ? (
            <button
              onClick={handleLogout}
              className="text-2xl font-light uppercase underline underline-offset-8 text-red-900 cursor-pointer bg-transparent border-none"
            >
              Logout ({username})
            </button>
          ) : (
            <Link
              href="/login"
              className="text-2xl font-light uppercase underline underline-offset-8 text-red-900"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-8 mb-8">
        {rooms !== undefined &&
          rooms.map((room) => (
            <RoomInfo
              key={room._id}
              room={room}
              handleJoinRoom={handleJoinRoom}
            />
          ))}
      </div>

      <HistoryTable gameHistory={gameHistory} />
    </main>
  );
}
