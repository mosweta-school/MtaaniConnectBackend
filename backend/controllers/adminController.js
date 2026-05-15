// Handles what happens when requests come in.
//Handles admin related requests such as viewing all users, deleting users, and managing events and analytics
const BASE_URL = 'http://localhost:8000'
export const getAllUsers = async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const users = await response.json();

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/events`);
    const events = await response.json();

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await fetch(`${BASE_URL}/events/${id}`, {
      method: "DELETE",
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminStats = async (req, res) => {
  try {
    const usersRes = await fetch(`${BASE_URL}/users`);
    const eventsRes = await fetch(`${BASE_URL}/events`);

    const users = await usersRes.json();
    const events = await eventsRes.json();

    // Category breakdown
    const categoryMap = {};

    events.forEach((event) => {
      const category = event.category || "unknown";
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    const categories = Object.entries(categoryMap).map(
      ([name, value]) => ({ name, value })
    );

    // Recent events
    const recentEvents = events.slice(-5).reverse();

    // Upcoming events
    const upcomingEvents = events.filter(
      (e) => new Date(e.date) > new Date()
    );

    res.json({
      totalUsers: users.length,
      totalEvents: events.length,
      upcomingEvents: upcomingEvents.length,

      analytics: {
        categories,
        users: [
          { name: "Total Users", value: users.length },
        ],
      },

      recentEvents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load admin stats",
      error: error.message,
    });
  }
};