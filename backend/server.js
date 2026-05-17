// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
app.use(cors());
app.use(express.json());


app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

/**
 * =========================
 * ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

/**
 * =========================
 * BASE ROUTE
 * =========================
 */
app.get("/", (req, res) => {
  res.send("MtaaniConnect API is running 🚀");
});

/**
 * =========================
 * CREATE HTTP SERVER
 * (Required for Socket.io)
 * =========================
 */
const server = http.createServer(app);

/**
 * =========================
 * SOCKET.IO SETUP
 * =========================
 */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Make io accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Example optional logging
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

/**
 * =========================
 * START SERVER
 * =========================
 */
// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("LocalConnect API is running...");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});