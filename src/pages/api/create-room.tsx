// pages/api/create-room.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Helper function to read the game data from the JSON file
const getGameData = () => {
  const filePath = path.join(process.cwd(), "src", "gameData.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};

// Helper function to update the game data in the JSON file
const updateGameData = (data: any) => {
  const filePath = path.join(process.cwd(), "/src/gameData.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, status, players, maxPlayers, currentPlayers } = req.body;

    const newRoom = {
      id: Date.now(),
      name,
      status,
      players,
      maxPlayers,
      currentPlayers,
    };
    console.log("Raptor - New Room:");
    console.log(__dirname, process.cwd());

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
