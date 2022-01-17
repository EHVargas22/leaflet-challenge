// create tile layers for map background
    // select from here:
    // https://leaflet-extras.github.io/leaflet-providers/preview/

var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// make map object
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 3
});

// ad default map
defaultMap.addto(myMap);
