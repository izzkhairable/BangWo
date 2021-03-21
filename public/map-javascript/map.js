// Script to handle Google Maps API requests and HTML geolocation requests to find user location
// Requires HTML body tag to have onload="getLocation()" to work

function retrieveApiKey() {
	//Return hard-coded Google Maps API Key
	//Please either include your own API key here or add code to retrieve from external source
	
	return "AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA";
}

function displayMapDirections(user_location) {
	var url = "https://www.google.com/maps/embed/v1/directions";
	var api_key = "?key=" + retrieveApiKey();
	var origin = "&origin=" + user_location.coords.latitude + "," + user_location.coords.longitude;
	var destination = "&destination=" + "S422456";

document.getElementById("map-display").setAttribute("src", url + api_key + origin +destination);	
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayMapDirections);
	} else {
		document.getElementById("map-display").innerHTML = "<h3>Geolocation is not supported by this browser.</h3>";
	}
}


