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
    GrayScale: grayscale,
    Watercolor: waterColor,
    Topography: topoMap,
    Default: defaultMap
};

// make map object
var myMap = L.map("map", {
    center: [36.7783, -119.4179],
    zoom: 5,
    layers: [grayscale, waterColor, topoMap, defaultMap]
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

// create variable to hold earthquakes layer
let earthquakes = new L.layerGroup();


// get earthquake data and populate layergroup

// call the USGS GeoJson API
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
.then(
    function(earthquakeData){

        // console log to test data load
        // console.log(earthquakeData);

        // make function that determines color of data points
        function dataColor(depth){
            if (depth > 90)
                return "red";
            else if (depth > 70)
                return "#fc4903";
            else if (depth > 50)
                return "#fc8403";
            else if (depth > 30)
                return "#fcad03";
            else if (depth > 10)
                return "#cafc03";
            else
                return "green";
        }
        
        // make function that determines radius of data points 
        function radiusSize(mag){
            if (mag == 0)
                return 1;
            else
                return mag * 5; 
        }

        // add styling to data points
        function dataStyle(feature)
        {
            return {
                opacity: 0.5,
                fillOpacity: 0.5,
                fillColor: dataColor(feature.geometry.coordinates[2]),
                color: "000000",
                radius: radiusSize(feature.properties.mag),
                weight: 0.5,
                stroke: true
            }
        }

        // add GeoJson data
        L.geoJson(earthquakeData, {

             // make each feature a marker on the map
             pointToLayer: function(feature, latLng) {
                 return L.circleMarker(latLng);
             },

             // set the style for each marker
             style: dataStyle,

             // add popus
             onEachFeature: function(feature, layer){
                layer.bindPopup(`Magnitude:<b>$${feature.properties.mag}</b><br>
                    Depth: <b>${feature.geometry.coordinates[2]}</b><br>
                    Location: <b>${feature.properties.place}</b>`);
             }
        }).addTo(earthquakes);
    });

// add earthquake layer
earthquakes.addTo(myMap);

// add the overlay for tectonic plates
let overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquake Data": earthquakes
};

// add layer control
L.control
    .layers(basemaps, overlays)
    .addTo(myMap);

// add legend to map
let legend = L.control({
    position: "bottomright"
});

//add properties for the legend
legend.onAdd = function(){
    // make div for the legend in the page
    let div = L.DomUtil.create("div", "info legend");

    // set intervals
    let intervals = [-10, 10, 30, 50, 70, 90];
    //set colors for the intervals
    let colors = [
        "green",
        "#cafc03",
        "#fcad03",
        "#fc8403",
        "#fc4903",
        "red"        
    ];
};

