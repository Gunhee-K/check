const MEETUP_API_KEY = "Replace_MEETUP_API_KEY";  // Replace with actual Meetup API key
let map, userMarker;
let markers = [];
let userLat, userLng;

// Ensure map is initialized when the page loads
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 47.6062, lng: -122.3321 }, // Default to Seattle
        zoom: 12
    });

    console.log("✅ Google Maps loaded successfully!");
}

// Get User's Current Location & Show on Map
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;

                map.setCenter({ lat: userLat, lng: userLng });

                if (userMarker) userMarker.setMap(null);
                userMarker = new google.maps.Marker({
                    position: { lat: userLat, lng: userLng },
                    map: map,
                    title: "Your Location",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                });
            },
            error => console.error("Error getting location:", error)
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Fetch events from Meetup API based on ZIP Code and update map
async function fetchEvents() {
    let zipCode = document.getElementById("zipCode").value;
    let url = `https://api.meetup.com/find/upcoming_events?&sign=true&photo-host=public&zip=${zipCode}&key=${MEETUP_API_KEY}`;

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();
        let eventsList = document.getElementById("events");
        eventsList.innerHTML = "";

        clearMarkers();

        if (!data.events || data.events.length === 0) {
            eventsList.innerHTML = "<p>No events found for this location.</p>";
            return;
        }

        data.events.forEach(event => {
            let eventDiv = document.createElement("div");
            eventDiv.innerHTML = `
                <strong>${event.name}</strong><br>
                <p>${event.description ? event.description : "No description available."}</p>
                <p>📍 ${event.venue ? event.venue.address_1 : "Location not available"}</p>
                <p>🕒 ${event.local_date} ${event.local_time}</p>
                <a href="${event.link}" target="_blank">View Event</a>
                <button onclick="navigateToEvent(${event.venue.lat}, ${event.venue.lon})">Navigate</button>
                <hr>
            `;
            eventsList.appendChild(eventDiv);

            if (event.venue && event.venue.lat && event.venue.lon) {
                addMarker(event.venue.lat, event.venue.lon, event.name);
            }
        });

    } catch (error) {
        console.error("Error fetching events:", error);
        document.getElementById("events").innerHTML = "<p>Error loading events. Check console.</p>";
    }
}

// Add marker on Google Maps
function addMarker(lat, lng, title) {
    let marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: title
    });
    markers.push(marker);
}

// Clear all previous markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

// Navigate to event from user's location
function navigateToEvent(eventLat, eventLng) {
    if (!userLat || !userLng) {
        alert("Please enable location services to navigate.");
        return;
    }

    let url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${eventLat},${eventLng}&travelmode=driving`;
    window.open(url, "_blank");
}
