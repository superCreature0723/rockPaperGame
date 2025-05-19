"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RoomInfo from "./components/lobby/RoomInfo";
import HistoryTable from "./components/lobby/HistoryTable";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  setPlayerOneActive,
  setIsPlaying,
} from "./redux/players/online-players.slice";
import {
  setRoom,
  setSockets,
  setRooms,
  addRoom,
} from "./redux/socket/socket.slice";

import { io } from "socket.io-client";
import OnlineGameStart from "./online/game-start";

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
  //const [rooms, setRooms] = useState<Room[]>([]);
  const { room, sockets } = useAppSelector((state) => state.socket);
  const rooms = useAppSelector((state) => state.socket.rooms);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const { isPlaying } = useAppSelector((state) => state.onlinePlayers);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setNewRoomName(room);
  }, [room]);

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

    socket.on("new-room", (newRoom: { room: Room }) => {
      console.log("New room created RAPTOR:", newRoom);
      dispatch(addRoom(newRoom.room));
    });

    // fetch rooms from backend (or better, dispatch an action that fetches rooms)
    fetchRooms();

    return () => {
      socket.off("user-login");
      socket.off("updated-users");
      socket.off("new-room");
    };
  }, [router, dispatch]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/get-rooms"); // Make sure the backend URL is correct
      if (response.ok) {
        const data = await response.json();
        dispatch(setRooms(data.rooms));
        console.log("Rooms fetched successfully:", data.rooms);
      } else {
        console.error("Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newRoomName.trim()) return; // prevent empty room name

    const playerName = localStorage.getItem("playerName");
    if (!playerName) {
      router.push("/login");
      return;
    }

    try {
      // Call backend API to create the room
      const response = await fetch("http://localhost:5000/api/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoomName.trim(),
          maxPlayers: 2, // or get from user input if applicable
          playerName: playerName,
        }),
      });

      const data = await response.json();
      console.log("Room creation response:", data);
      if (response.ok) {
        // Dispatch player one active if needed
        dispatch(setPlayerOneActive(true));

        // Emit join-room event with the new room's ID or name (use whichever your backend expects)
        socket.emit("join-room", data._id || data.name);

        setSuccessMessage(`You created room ${data.name} & joined`);

        // Optionally reset input and redux room state
        setNewRoomName("");
        dispatch(setRoom(""));

        // Also add the new room to redux store to update the UI immediately (optional)
        //dispatch(addRoom(data.room));
      } else {
        setSuccessMessage(data.error || "Failed to create room");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      setSuccessMessage("Error creating room");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("playerName"); // Remove stored username
    router.push("/login"); // Redirect to login page
  };

  const handleJoinRoom = async (roomId: string) => {
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
  const handleChangeRoom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRoomName(e.target.value.trim());
    dispatch(setRoom(e.target.value.trim()));
  };



  return (
    <>
      {isPlaying ? (
        <OnlineGameStart />
      ) : (
        <main className="w-full flex flex-col items-center justify-center min-h-screen bg-stone-200 p-4">
          <h1 className="text-4xl font-bold text-yellow-900 mb-8">
            Welcome To Rock Paper Scissors
          </h1>

          <div className="flex justify-between w-full max-w-4xl mb-8">
            <form onSubmit={handleCreateRoom} className="mb-8">
              <input
                type="text"
                value={newRoomName}
                onChange={handleChangeRoom}
                className="px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter room name"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg ml-4"
              >
                Create Room
              </button>
            </form>

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

          {<p>{successMessage}</p>}
          {successMessage && !successMessage.includes("two players") && (
            <p>Wait for an opponent to join</p>
          )}

          <div className="flex gap-8 mb-8">
            {rooms !== undefined &&
              rooms.map((room, idx) => (
                <RoomInfo
                  key={idx}
                  room={room}
                  handleJoinRoom={handleJoinRoom}
                />
              ))}
          </div>

          <HistoryTable gameHistory={gameHistory} />
        </main>
      )}
    </>
  );
}
