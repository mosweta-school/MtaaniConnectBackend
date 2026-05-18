// controllers/adminController.js

import { readDB, writeDB } from "../utils/db.js";


// ======================================================
// GET ALL USERS
// ======================================================
export const getAllUsers = (req, res) => {
  try {
    const db = readDB();
    res.json(db.users || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
  }
};


// ======================================================
// GET ALL EVENTS
// ======================================================
export const getAllEvents = (req, res) => {
  try {
    const db = readDB();
    res.json(db.events || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to load events" });
  }
};


// ======================================================
// DELETE USER
// ======================================================
export const deleteUser = (req, res) => {
  try {
    const db = readDB();

    db.users = db.users.filter(
      (user) => String(user.id) !== String(req.params.id)
    );

    // also remove their events (optional but good practice)
    db.events = db.events.filter(
      (event) => String(event.createdBy) !== String(req.params.id)
    );

    writeDB(db);

    const io = req.app.get("io");
    io.emit("User-Deleted", response.data);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};


// ======================================================
// DELETE EVENT
// ======================================================
export const deleteEvent = (req, res) => {
  try {
    const db = readDB();

    db.events = db.events.filter(
      (event) => String(event.id) !== String(req.params.id)
    );

    writeDB(db);

    const io = req.app.get("io");
    io.emit("Event-Deleted", response.data);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};


// ======================================================
// ADMIN ANALYTICS DASHBOARD
// ======================================================
export const getAdminStats = (req, res) => {
  try {
    const db = readDB();

    const users = db.users || [];
    const events = db.events || [];

    // ---------------------------
    // CATEGORY ANALYTICS
    // ---------------------------
    const categoryMap = {};

    events.forEach((event) => {
      const category = event.category || "Unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categories = Object.entries(categoryMap).map(
      ([name, value]) => ({ name, value })
    );

    // ---------------------------
    // LOCATION ANALYTICS
    // ---------------------------
    const locationMap = {};

    events.forEach((event) => {
      const location = event.locationName || "Unknown";
      locationMap[location] = (locationMap[location] || 0) + 1;
    });

    const activeLocations = Object.entries(locationMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // ---------------------------
    // UPCOMING EVENTS
    // ---------------------------
    const upcomingEvents = events.filter(
      (event) => new Date(event.date) > new Date()
    );

    // ---------------------------
    // RECENT EVENTS
    // ---------------------------
    const recentEvents = [...events]
      .sort((a, b) =>
        new Date(b.createdAt || b.date) -
        new Date(a.createdAt || a.date)
      )
      .slice(0, 5);

    // ---------------------------
    // RESPONSE
    // ---------------------------
    res.json({
      totalUsers: users.length,
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,

      analytics: {
        categories,
        users: [
          {
            name: "Registered Users",
            value: users.length,
          },
        ],
        activeLocations,
      },

      recentEvents,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate admin stats",
    });
  }
};