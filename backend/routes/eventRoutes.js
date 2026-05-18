import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getSingleEvent,
  joinEvent,
  leaveEvent,
  getEventAttendees
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getSingleEvent); // Fixed: removed duplicate route

// Protected routes
router.post("/", protect, createEvent);
router.get("/my-events", getMyEvents);

router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/join", protect, joinEvent);
router.post("/:id/leave", protect, leaveEvent);
router.get("/:id/attendees", protect, getEventAttendees);

export default router;