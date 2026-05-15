import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "https://mtaani-connect-nine.vercel.app",
    credentials: true
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("LocalConnect API is running...");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});