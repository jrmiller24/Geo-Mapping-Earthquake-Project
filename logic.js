// Store our API endpoint as queryUrl
var queryUrl = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`;

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map


  var earthquakes = L.geoJSON(data.features, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker (latlng);
    }, 
    style: circleStyle,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("magnitude: " + feature.properties.mag + "<br>location: " + feature.properties.place)
    },


  });

function circleStyle(feature) {
  return{
    opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
  }
}

function getColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    };
  }
  function getRadius(magnitude) {
    if(magnitude === 0) {
      return 1;
    } return magnitude *4
  }


// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJtaWxsZXIyNDkwIiwiYSI6ImNqeDEzMzRuaTA1a3Q0OXBkcmN1cGgxMXgifQ.Wae4gzJfzt3JYnMHjyhSgg");
 
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoianJtaWxsZXIyNDkwIiwiYSI6ImNqeDEzMzRuaTA1a3Q0OXBkcmN1cGgxMXgifQ.Wae4gzJfzt3JYnMHjyhSgg");

// Define a baseMaps object to hold our base layers
var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
};

var overlayMaps = {
  Earthquakes : earthquakes
  };

// Create a new map
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [streetmap]
});

// Create a layer control containing our baseMaps
// Be sure to add an overlay Layer containing the earthquake GeoJSON
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

});