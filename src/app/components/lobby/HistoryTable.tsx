"use client";

import Link from "next/link";

interface GameHistory {
  roomName: string;
  winner: string;
  timestamp: string;
}


const HistoryTable = ({ gameHistory }: { gameHistory: GameHistory }) => {
  return (
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
          {gameHistory !== undefined && gameHistory.map((game, index) => (
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
  );
};

export default HistoryTable;
