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

const RoomInfo = ({ room }: { room: Room }) => {
  return (
    <div
      key={room.id}
      className="flex flex-col items-center p-6 border-2 border-black rounded-xl w-1/3"
    >
      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {room.currentPlayers}/{room.maxPlayers} currentPlayers - {room.status}
      </p>
      <Link
        href={`/game`}
        className="px-4 py-2 border-2 border-black rounded-xl text-center text-gray-800 font-medium"
      >
        Join
      </Link>
    </div>
  );
};

export default RoomInfo;
