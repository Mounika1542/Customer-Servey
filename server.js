// ✅ Vercel-compatible Serverless Function version of your server.js
// Place this file in /api/submit.js

const fs = require("fs");
const path = require("path");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const responses = req.body;
  const filePath = path.join(process.cwd(), "survey_data.json"); // Use process.cwd() in serverless

  let allResponses = [];
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      allResponses = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading/parsing file:", err);
  }

  allResponses.push({
    timestamp: new Date().toISOString(),
    responses,
  });

  try {
    fs.writeFileSync(filePath, JSON.stringify(allResponses, null, 2));
    return res.status(200).json({ message: "✅ Submitted successfully" });
  } catch (err) {
    console.error("Write error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
