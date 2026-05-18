import { readDB, writeDB } from "../utils/db.js";

// ======================================================
// CREATE EVENT
// ======================================================
export const createEvent = (req, res) => {
  try {
    const {
      title,
      category,
      description,
      date,
      time,
      locationName,
      latitude,
      longitude,
      maxAttendees,
      createdBy,
      organizerName,
    } = req.body;

    if (!title || !category || !description || !date || !time || !locationName) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const db = readDB();

    const newEvent = {
      id: Date.now().toString(),
      title,
      category,
      description,
      date,
      time,
      locationName,
      latitude,
      longitude,
      maxAttendees: maxAttendees || 0,
      createdBy,
      organizerName,
      attendees: [],
      createdAt: new Date().toISOString(),
    };

    db.events.push(newEvent);
    writeDB(db);
    const io = req.app.get("io");
    io.emit("new-event", response.data);

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// GET ALL EVENTS
// ======================================================
export const getEvents = (req, res) => {
  try {
    const db = readDB();
    return res.json({ events: db.events });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// GET SINGLE EVENT
// ======================================================
export const getSingleEvent = (req, res) => {
  try {
    const db = readDB();
    const event = db.events.find((e) => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// UPDATE EVENT
// ======================================================
export const updateEvent = (req, res) => {
  try {
    const db = readDB();

    const index = db.events.findIndex((e) => e.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = db.events[index];

    if (String(event.createdBy) !== String(req.body.userId)) {
      return res.status(403).json({
        message: "You can only edit your own events",
      });
    }

    db.events[index] = {
      ...event,
      ...req.body,
    };

    writeDB(db);
    const io = req.app.get("io");
    io.emit("Event-Updated", response.data);

    return res.json({
      message: "Event updated successfully",
      event: db.events[index],
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// DELETE EVENT
// ======================================================
export const deleteEvent = (req, res) => {
  try {
    const db = readDB();

    const event = db.events.find((e) => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (String(event.createdBy) !== String(req.body.userId)) {
      return res.status(403).json({
        message: "You can only delete your own events",
      });
    }

    db.events = db.events.filter((e) => e.id !== req.params.id);

    writeDB(db);

    const io = req.app.get("io");
    io.emit("Event-Deleted", response.data);

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// GET MY EVENTS 
// ======================================================
export const getMyEvents = (req, res) => {
  try {
    const db = readDB();
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Filter events by the authenticated user's ID
    const myEvents = db.events.filter(
      (e) => String(e.createdBy) === String(user.id)
    );

    return res.json({ events: myEvents });
  } catch (err) {
    console.error("Get my events error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// JOIN EVENT
// ======================================================
export const joinEvent = (req, res) => {
  try {
    const db = readDB();

    const event = db.events.find((e) => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendee = req.body;

    const alreadyJoined = event.attendees.find(
      (u) => String(u.id) === String(attendee.id)
    );

    if (alreadyJoined) {
      return res.status(400).json({
        message: "Already joined",
      });
    }

    if (
      Number(event.maxAttendees) > 0 &&
      event.attendees.length >= Number(event.maxAttendees)
    ) {
      return res.status(400).json({
        message: "Event full",
      });
    }

    event.attendees.push(attendee);

    writeDB(db);

    const io = req.app.get("io");
    io.emit("Attendee Joined", response.data);

    return res.json({
      message: "Joined event",
      attendees: event.attendees,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// LEAVE EVENT
// ======================================================
export const leaveEvent = (req, res) => {
  try {
    const db = readDB();

    const event = db.events.find((e) => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.attendees = event.attendees.filter(
      (u) => String(u.id) !== String(req.body.userId)
    );

    writeDB(db);

    const io = req.app.get("io");
    io.emit("Attendee-Left", response.data);

    return res.json({
      message: "Left event",
      attendees: event.attendees,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// ======================================================
// GET EVENT ATTENDEES (ONLY ORGANIZER)
// ======================================================
export const getEventAttendees = (req, res) => {
  try {
    const db = readDB();

    const event = db.events.find((e) => e.id === req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (String(event.createdBy) !== String(req.query.organizerId)) {
      return res.status(403).json({
        message: "Only organizer can view attendees",
      });
    }

    return res.json({
      attendees: event.attendees || [],
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};