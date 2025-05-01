// src/pages/api/gameData.ts

import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Helper function to read the game data from the JSON file
const getGameData = () => {
  const filePath = path.join(process.cwd(), "src", "gameData.json"); // Adjust path if needed
  const fileContents = fs.readFileSync(filePath, "utf8");
  console.log("RAPTOR:", fileContents); // Debugging line to check file contents
  return JSON.parse(fileContents);
};

// Helper function to update the game data in the JSON file
const updateGameData = (data: any) => {
  const filePath = path.join(process.cwd(), "src", "gameData.json"); // Adjust path if needed
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Get the current game data
      const gameData = getGameData();
      res.status(200).json(gameData); // Send game data as JSON response
    } catch (error) {
      res.status(500).json({ error: "Failed to read game data" });
    }
  } else if (req.method === "POST") {
    try {
      const gameData = getGameData();
      const { roomId, player } = req.body;

      // Find the room to update
      const room = gameData.rooms.find((room: any) => room.id === roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }

      // Add player to the room if there's space
      if (room.players.length < room.maxPlayers) {
        room.players.push(player);
        room.status =
          room.players.length === room.maxPlayers ? "Full" : room.status;
        updateGameData(gameData);
        res.status(200).json(gameData);
      } else {
        res.status(400).json({ error: "Room is full" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update game data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
