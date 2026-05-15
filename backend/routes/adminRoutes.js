import express from "express";
import {
  getAllUsers,
  getAllEvents,
  deleteUser,
  deleteEvent,
  getAdminStats,
} from "../controllers/adminController.js";

const router = express.Router();

// dashboard
router.get("/", getAdminStats);

// management endpoints
router.get("/users", getAllUsers);
router.get("/events", getAllEvents);

router.delete("/users/:id", deleteUser);
router.delete("/events/:id", deleteEvent);

export default router;