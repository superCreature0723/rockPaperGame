// pages/api/check-user.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";


const getUserData = () => {
  const filePath = path.join(process.cwd(),"src", "userData.json");
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return { users: [] }; // Return empty array if file doesn't exist or there's an error
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username } = req.body;

   
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    try {
      // Get the current user data
      const userData = getUserData();

      // Check if the username exists in the users list
      const userExists = userData.users.some(
        (user: any) => user.username === username
      );

      if (userExists) {
        return res.status(200).json({ message: "User exists" });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to check user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
