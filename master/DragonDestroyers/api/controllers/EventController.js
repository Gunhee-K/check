const axios = require('axios');

const MEETUP_API_KEY = "YOUR_MEETUP_API_KEY"; // Replace with your actual Meetup API key

module.exports = {
  async fetchEvents(req, res) {
    try {
      const zipCode = req.query.zip || "98101"; // Default ZIP Code if none provided
      const url = `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&zip=${zipCode}&key=${MEETUP_API_KEY}`;

      const response = await axios.get(url);
      return res.json(response.data.events);
    } catch (error) {
      return res.serverError({ error: "Failed to fetch events", details: error.message });
    }
  },

  async addEvent(req, res) {
    const { eventName, eventLocation } = req.body;
    return res.json({ message: `Event "${eventName}" added at ${eventLocation} (simulation).` });
  },

  async deleteEvent(req, res) {
    const eventId = req.params.id;
    return res.json({ message: `Event ID ${eventId} deleted (simulation).` });
  }
};
