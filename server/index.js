import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 2000;

app.use(cors());
app.use(bodyParser.json());

let videoData = [];

// Save Video and Captions
app.post("/api/video", async (req, res) => {
  const { url, captions } = req.body;
  videoData = { url, captions };
  res.status(201).json({ message: "Video data saved successfully" });
});


// Test API
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
