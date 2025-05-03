// pages/api/create-room.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const gameDataPath = path.resolve("data", "gameData.json");

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
    const { name, status, maxPlayers, currentPlayers, playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: "Player name is required" });
    }
    const gameData = getGameData();


    const newRoom = {
      id: gameData.rooms.length + 1,
      name,
      status,
      maxPlayers,
      currentPlayers,
      players: [
        {
          id: 1,
          name: playerName,
          userSelect: "none",
          score: 0,
        },
      ],
      roundCounter: 0,
    };

    try {
      // Get the current game data
      const gameData = getGameData();

      // Add the new room to the rooms array
      gameData.rooms.push(newRoom);

      // Update the game data in the JSON file
      updateGameData(gameData);

      // Send the response back
      res.status(200).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: "Failed to create room" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
