const API_URL = "http://localhost:3000/api/events";
const GOOGLE_MAPS_API_KEY = "AIzaSyASy5UVV-2EFbOZFsatHtumZ1VEFY_84rU";

// Fetch all events from API
async function fetchEvents() {
    let zipCode = document.getElementById("zipCode").value;
    let url = zipCode ? `${API_URL}?zipCode=${zipCode}` : API_URL; // Append ZIP code if entered

    try {
        let response = await fetch(url);
        let events = await response.json();
        let eventsList = document.getElementById("events");
        eventsList.innerHTML = "";

        if (events.length === 0) {
            eventsList.innerHTML = "<p>No events found for this ZIP Code.</p>";
            return;
        }

        events.forEach(event => {
            let eventDiv = document.createElement("div");
            eventDiv.innerHTML = `
                <strong>${event.name}</strong><br>
                📍 ${event.location} | 🕒 ${event.date}<br>
                ${event.description}<br>
                <button onclick="showOnMap('${event.location}')">Show on Map</button>
                <hr>
            `;
            eventsList.appendChild(eventDiv);
        });

    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

// Add a new event
async function addEvent() {
    let name = document.getElementById("eventName").value;
    let location = document.getElementById("eventLocation").value;
    let date = document.getElementById("eventDate").value;
    let description = document.getElementById("eventDescription").value;

    let newEvent = { name, location, date, description };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
    });

    fetchEvents();
}

// Delete an event
async function deleteEvent() {
    let eventId = document.getElementById("eventId").value;

    await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE"
    });

    fetchEvents();
}

// Initialize Google Map
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: 12
    });
}

// Show event location on the map
async function showOnMap(location) {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert("Could not find location.");
        }
    });
}

fetchEvents();
