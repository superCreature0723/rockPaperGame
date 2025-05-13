
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";


const getUserData = () => {
  const filePath = path.join(process.cwd(), "src", "userData.json");
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return { users: [] }; // Return empty array if file doesn't exist or there's an error
  }
};

// Helper function to update the user data in the JSON file
const updateUserData = (data: any) => {
  const filePath = path.join(process.cwd(), "src", "userData.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username, email } = req.body;

    // Check if username or email are missing
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    const newUser = { id: Date.now(), username, email };

    try {
      // Get the current user data
      const userData = getUserData();

      // Check if the user already exists
      const userExists = userData.users.some(
        (user: any) => user.username === username || user.email === email
      );

      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Add the new user to the user array
      userData.users.push(newUser);

      // Update the user data in the JSON file
      updateUserData(userData);

      // Send the response back
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to save user" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
