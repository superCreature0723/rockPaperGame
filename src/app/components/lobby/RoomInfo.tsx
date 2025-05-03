"use client";

import Link from "next/link";

interface Room {
  id: number;
  name: string;
  status: string;
  players: { id: number; name: string }[];
  currentPlayers: number;
  maxPlayers: number;
}

const RoomInfo = ({
  room,
  handleJoinRoom,
}: {
  room: Room;
  handleJoinRoom: (roomId: number) => void;
}) => {
  return (
    <div
      key={room.id}
      className="flex flex-col items-center p-6 border-2 border-black rounded-xl w-1/3"
    >
      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {room.currentPlayers}/{room.maxPlayers} currentPlayers - {room.status}
      </p>

      <button
        onClick={() => handleJoinRoom(room.id)}
        disabled={room.players.length >= room.maxPlayers}
        className="bg-green-500 text-white py-2 px-4 rounded mt-2"
      >
        {room.players.length < room.maxPlayers ? "Join Room" : "Room Full"}
      </button>
    </div>
  );
};

export default RoomInfo;
