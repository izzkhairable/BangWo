// Script to handle Google Maps API requests and HTML geolocation requests to find user location
// Requires HTML body tag to have onload="getLocation()" to work

function retrieveApiKey() {
	//Return hard-coded Google Maps API Key
	//Please either include your own API key here or add code to retrieve from external source
	
	return "AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA";
}

//getLocation() accepts a string instruction to determine what type of Google Map is displayed
//If param is "directions", it will display directions to go from origin to destination
//If param is "user-location", it will display user's current location
function getLocation(instruction) {
	if (navigator.geolocation) {
		if (instruction=="directions") {
			navigator.geolocation.getCurrentPosition(displayMapDirections);
		} else if (instruction=="user-location") {
			navigator.geolocation.getCurrentPosition(displayCurrentLocation);
		}
	} else {
		document.getElementById("map-display").innerHTML = "<h3>Geolocation is not supported by this browser.</h3>";
	}
}

function displayCurrentLocation(user_location) {
	var url = "https://www.google.com/maps/embed/v1/place";
	var api_key = "?key=" + retrieveApiKey();
	var query = "&q=" + user_location.coords.latitude + "," + user_location.coords.longitude;

document.getElementById("map-display").setAttribute("src", url + api_key + query);	
}

function displayMapDirections(user_location) {
	var url = "https://www.google.com/maps/embed/v1/directions";
	var api_key = "?key=" + retrieveApiKey();
	var origin = "&origin=" + user_location.coords.latitude + "," + user_location.coords.longitude;
	var destination = "&destination=" + "S422456";

document.getElementById("map-display").setAttribute("src", url + api_key + origin +destination);	
}

