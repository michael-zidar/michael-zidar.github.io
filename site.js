document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle');
    const menu = document.getElementById('menu');
    const logo = document.getElementById('logo');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    toggleButton.addEventListener('click', function () {
        menu.classList.toggle('hidden');
        logo.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });
});


// if the page contains the map element
if (document.getElementById('map')) {

    let map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Initialize the marker cluster group
    let markers = L.markerClusterGroup();
    let markerMap = {};  // To store marker references by title
    let content_json = [];

    // Fetch the data from the data/content.json file
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            content_json = data;
            data.forEach(location => {
                if (location.latitude && location.longitude) {
                    let marker = L.circleMarker([location.latitude, location.longitude], {
                        color: '#F7CC57',
                        opacity: 0.5,
                        fillColor: '#811E42',
                        fillOpacity: 1,
                        radius: 5
                    }).bindPopup(`<h2>${location.title}</h2><p>${location.agency}</p>`);

                    // Ensure title is unique and add marker to markerMap
                    if (!markerMap[location.title]) {
                        markerMap[location.title] = marker;
                        // Add the marker to the cluster group
                        markers.addLayer(marker);
                    }
                }
            });

            map.addLayer(markers);

            if (markers.getLayers().length > 0) {
                map.fitBounds(markers.getBounds());
            }


            let table = document.getElementById('table');

            // Add Tailwind classes to the table
            table.classList.add(
                'w-full',
                'border-collapse',
                'border',
                'border-gray-300',
                'divide-y',
                'divide-gray-300',
                'shadow-md',
            );

            // Add Tailwind classes to table header cells (if any)
            let headers = table.querySelectorAll('th');
            headers.forEach(header => {
                header.classList.add('px-4', 'py-2', 'bg-gray-200', 'text-left', 'font-semibold');
            });

            data.forEach(location => {
                if (location.latitude || location.longitude) {
                    let row = table.insertRow(-1);
                    let title = row.insertCell(0);
                    let agency = row.insertCell(1);
                    let agency_location = row.insertCell(2);

                    title.innerHTML = location.title;
                    agency.innerHTML = location.agency;
                    agency_location.innerHTML = location.location;
                }
            });

            // Add an event listener for the table rows
            let rows = document.querySelectorAll('#table tr');
            rows.forEach(row => {
                let cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.classList.add('px-4', 'py-2', 'border-t', 'border-gray-200');
                });
                row.addEventListener('click', () => {
                    let title = row.cells[0].innerHTML;
                    let location = content_json.find(location => location.title === title);
                    if (location && location.latitude && location.longitude) {
                        map.setView([location.latitude, location.longitude], 10);
                        if (markerMap[title]) {
                            markerMap[title].openPopup();  // Open the marker's popup when row is clicked
                        }
                    }
                });
            });

            // Add an event listener for the search input
            let search = document.getElementById('search');
            search.addEventListener('input', () => {
                let value = search.value.toLowerCase();
                rows.forEach(row => {
                    let title = row.cells[0].innerHTML.toLowerCase();
                    let agency = row.cells[1].innerHTML.toLowerCase();
                    let location = row.cells[2].innerHTML.toLowerCase();

                    if (title.includes(value) || agency.includes(value) || location.includes(value)) {
                        row.style.display = '';
                        if (markerMap[row.cells[0].innerHTML]) {
                            markerMap[row.cells[0].innerHTML].addTo(markers); // Show matching markers
                        }
                    } else {
                        row.style.display = 'none';
                        if (markerMap[row.cells[0].innerHTML]) {
                            markers.removeLayer(markerMap[row.cells[0].innerHTML]); // Hide non-matching markers
                        }
                    }
                });
                if (markers.getLayers().length > 0) {
                    map.fitBounds(markers.getBounds());
                }
            });

            // Add an event listener for the reset button
            let reset = document.getElementById('reset');
            reset.addEventListener('click', () => {
                search.value = '';
                rows.forEach(row => {
                    row.style.display = '';
                    if (markerMap[row.cells[0].innerHTML]) {
                        markerMap[row.cells[0].innerHTML].addTo(markers); // Show all markers
                    }
                });
                if (markers.getLayers().length > 0) {
                    map.fitBounds(markers.getBounds());
                }
            });

            // Add an event listener for the filter input
            let filter = document.getElementById('filter');
            filter.addEventListener('input', () => {
                let value = filter.value.toLowerCase();
                rows.forEach(row => {
                    let country = row.cells[2].innerHTML.toLowerCase();
                    if (country.includes(value)) {
                        row.style.display = '';
                        if (markerMap[row.cells[0].innerHTML]) {
                            markerMap[row.cells[0].innerHTML].addTo(markers); // Show matching markers
                        }
                    } else {
                        row.style.display = 'none';
                        if (markerMap[row.cells[0].innerHTML]) {
                            markers.removeLayer(markerMap[row.cells[0].innerHTML]); // Hide non-matching markers
                        }
                    }
                });
                if (markers.getLayers().length > 0) {
                    map.fitBounds(markers.getBounds());
                }
            });
        })
        .catch(error => console.error('Error fetching the data:', error));

}