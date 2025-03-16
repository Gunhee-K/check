const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;
const dataFile = "events.json";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load events from JSON file
const loadData = () => {
    try {
        const data = fs.readFileSync(dataFile, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Save events to JSON file
const saveData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// **GET: Retrieve all events**
app.get("/api/events", (req, res) => {
    const zipCode = req.query.zipCode; // Get ZIP Code from the request

    let events = loadData(); // Load all events

    if (zipCode) {
        // Filter events by ZIP Code
        events = events.filter(event => event.location.includes(zipCode));
    }

    res.json(events);
});

// **POST: Add a new event**
app.post("/api/events", (req, res) => {
    let events = loadData();
    const newEvent = {
        id: Date.now().toString(),
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    };

    events.push(newEvent);
    saveData(events);
    
    res.json({ message: "Event added", event: newEvent });
});

// **DELETE: Remove an event**
app.delete("/api/events/:id", (req, res) => {
    let events = loadData();
    const newEvents = events.filter(event => event.id !== req.params.id);

    if (events.length === newEvents.length) {
        return res.status(404).json({ message: "Event not found" });
    }

    saveData(newEvents);
    res.json({ message: "Event deleted successfully" });
});

// **Start server**
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
