import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import express from "express";
import authRouter from "./routes/auth.router.js";
import messageRouter from "./routes/messages.router.js";
import { connectDB } from "./lib/db.connection.js";
import { app, server } from "./lib/socketIO.js";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FrontendUrl,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the server
server.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1);
  }
});
