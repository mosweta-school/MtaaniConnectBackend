import express from "express";
import {
  getAllUsers,
  getAllEvents,
  deleteUser,
  deleteEvent,
  getAdminStats,
  toggleUserRole,
  toggleUserStatus
  
} from "../controllers/adminController.js";

const router = express.Router();

// dashboard
router.get("/", getAdminStats);

// management endpoints
router.get("/users", getAllUsers);
router.get("/events", getAllEvents);

router.delete("/users/:id", deleteUser);
router.delete("/events/:id", deleteEvent);
router.patch("/users/:id/role", toggleUserRole);
router.patch("/users/:id/status", toggleUserStatus);

export default router;