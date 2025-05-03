// src/pages/api/join-room.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Path to the gameData.json file
const gameDataPath = path.join(process.cwd(), "src", "gameData.json");

const getGameData = () => {
  const filePath = path.join(process.cwd(), "src", "gameData.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};

// Helper function to update the game data in the JSON file
const updateGameData = (data: any) => {
  const filePath = path.join(process.cwd(), "src", "gameData.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { roomId, playerName } = req.body;

    // Check if roomId and playerName are provided
    if (!roomId || !playerName) {
      return res
        .status(400)
        .json({ message: "Room ID and player name are required" });
    }

    try {
      // Read the current game data from the JSON file
      const gameData = JSON.parse(fs.readFileSync(gameDataPath, "utf8"));

      // Find the room with the given roomId
      const room = gameData.rooms.find((room) => room.id === roomId);

      if (!room) {
        return res.status(400).json({ message: "Room does not exist" });
      }

      // Check if the room already has two players
      if (room.players.length >= 2) {
        return res.status(400).json({ message: "Room is full" });
      }

      // Add the new player to the room
      const newPlayer = {
        id: room.players.length + 1, // Increment the player ID
        name: playerName, // Player name from the request
        userSelect: "none", // Default selection to "none"
        score: 0, // Initial score for the new player
      };

      // Push the new player to the players array
      room.players.push(newPlayer);

      // Save the updated game data back to the JSON file
      fs.writeFileSync(gameDataPath, JSON.stringify(gameData, null, 2));

      // Return the updated room data
      return res.status(200).json(room);
    } catch (error) {
      console.error("Error reading or writing the game data", error);
      return res.status(500).json({ message: "Failed to join room" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
