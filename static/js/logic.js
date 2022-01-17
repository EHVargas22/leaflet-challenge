// create tile layers for map background
    // select from here:
    // https://leaflet-extras.github.io/leaflet-providers/preview/

var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// add grayscale layer
var grayscale = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// watercolor layer
var waterColor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

// topography layer
let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// make basemaps object
let basemaps = {
    Default: defaultMap,
    GrayScale: grayscale,
    Watercolor: waterColor,
    Topography: topoMap
};

// make map object
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 3,
    layers: [defaultMap, grayscale, waterColor, topoMap]
});

// add default map
defaultMap.addTo(myMap);


// get data for tectonic plates and draw on the map:

// variable to hold tectonica plate layer
let tectonicplates = new L.layerGroup();

// call api for tectonic plate info
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
.then(function(plateData){

    // console log to ensure data loads
    // console.log([plateData]);

    // load data using geoJson and add to tectonic plates layer
    L.geoJson(plateData, {
        // add styling to visualize lines/boundaries
        color: "yellow",
        weight: 1
    }).addTo(tectonicplates);
})

// add tectonic plates to map
tectonicplates.addTo(myMap);

// add the overlay for tectonic plates
let overlays = {
    "Tectonic Plates": tectonicplates
};

// add layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);