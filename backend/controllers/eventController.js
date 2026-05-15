
import axios from "axios";

const EVENTS_API = "http://localhost:8000/events";


// CREATE EVENT
export const createEvent = async (req, res) => {

  try {

    const eventData = req.body;

    const response = await axios.post(
      EVENTS_API,
      eventData
    );

    res.status(201).json({
      message: "Event created successfully",
      event: response.data,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });

  }
};


// GET ALL EVENTS
export const getEvents = async (req, res) => {

  try {

    const response = await axios.get(EVENTS_API);

    res.status(200).json({
      events: response.data,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message,
    });

  }
};


// UPDATE EVENT
export const updateEvent = async (req, res) => {

  try {

    const { id } = req.params;

    const updatedData = req.body;

    const response = await axios.put(
      `${EVENTS_API}/${id}`,
      updatedData
    );

    res.status(200).json({
      message: "Event updated successfully",
      event: response.data,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });

  }
};


// DELETE EVENT
export const deleteEvent = async (req, res) => {

  try {

    const { id } = req.params;

    await axios.delete(
      `${EVENTS_API}/${id}`
    );

    res.status(200).json({
      message: "Event deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });

  }
};


// GET MY EVENTS
export const getMyEvents = async (req, res) => {

  try {

    const { userId } = req.params;

    const response = await axios.get(EVENTS_API);

    const myEvents = response.data.filter(
      (event) =>
        String(event.createdBy) === String(userId)
    );

    res.status(200).json({
      events: myEvents,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch user events",
      error: error.message,
    });

  }
};

