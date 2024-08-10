let map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize the marker cluster group
let markers = L.markerClusterGroup();

// Fetch the data from the data/content.json file
fetch('data/content.json')
.then(response => response.json())
.then(data => {
    data.forEach(location => {
        if (location.latitude && location.longitude) {
            let marker = L.circleMarker([location.latitude, location.longitude], {
                color: '#F7CC57',
                opacity: 0.5,
                fillColor: '#811E42',
                fillOpacity: 1,
                radius: 5
            }).bindPopup(`<h2>${location.title}</h2><p>${location.agency}</p>`);
            
            // Add the marker to the cluster group instead of the map
            markers.addLayer(marker);
        }
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);
});