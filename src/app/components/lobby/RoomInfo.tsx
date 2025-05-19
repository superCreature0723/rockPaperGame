"use client";

import { Room } from "@/app/redux/socket/socket.slice";
import Link from "next/link";

// interface Room {
//   _id: number;
//   name: string;
//   status: string;
//   players: { id: number; name: string }[];
//   currentPlayers: number;
//   maxPlayers: number;
// }

const RoomInfo = ({
  room,
  handleJoinRoom,
}: {
  room: Room;
  handleJoinRoom: (roomId: string) => void;
}) => {
  return (
    <div
      key={room.name}
      className="flex flex-col items-center p-6 border-2 border-black rounded-xl w-1/3"
    >
      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {room.currentPlayers}/{room.maxPlayers} currentPlayers - {room.status}
      </p>

      <button
        onClick={() => console.log("Joining room Raptor:", room._id)}
        disabled={(room.players?.length ?? 0) >= room.maxPlayers}
        className="bg-green-500 text-white py-2 px-4 rounded mt-2"
      >
        {(room.players?.length ?? 0 < room.maxPlayers)
          ? "Join Room"
          : "Room Full"}
      </button>
    </div>
  );
};

export default RoomInfo;
