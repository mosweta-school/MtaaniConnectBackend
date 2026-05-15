import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getMyEvents
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: get all events
router.get("/", getEvents);

// Protected: create event
router.post("/", protect, createEvent);

// Protected: user events
router.get("/my-events", protect, getMyEvents);

// Update event
router.put("/:id", protect, updateEvent);

// Delete event
router.delete("/:id", protect, deleteEvent);

export default router;