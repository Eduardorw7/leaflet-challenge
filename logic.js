var path = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(path).then(function(data){
    createFeatures(data.features);
});

function getColor(magnitude) {
    const colorRanges = [
        {min: 0, max: 2, color: "#FFFF00"},
        {min: 2, max: 4, color: "#FFA500"},
        {min: 4, max: 6, color: "#FF5733"},
        {min: 6, max: 8, color: "#FF0000"},
        {min: 8, max: 10, color: "#800080"},
    ];
    for (const range of colorRanges) {
        if (range.min <= magnitude && magnitude <= range.max) {
            return range.color;
        }
    }
    return "#808080";
}

function createCustomMarker(feature, latlng) {
    var options = {
        radius: feature.properties.mag * 8,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };
    return L.circleMarker(latlng, options);
}

function createFeatures(data) {
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
        <p>${new Date(feature.properties.time)}</p><hr>
        <p>Magnitude: ${feature.properties.mag}</p><hr>
        <p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
    let earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: createCustomMarker
    });
    createMap(earthquakes);
}

function createMap(earthquakes) {
    let streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetLayer,
        "Dark Map": darkLayer
    };

    let overlayMaps = {
        Earthquakes: earthquakes
    };

    let myMap = L.map("map", {
        center: [20, 0],
        zoom: 2,
        layers: [darkLayer, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
