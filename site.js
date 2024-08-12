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


function styleMarkdown(element) {
    // Styling headings
    element.querySelectorAll('h1').forEach(h1 => {
        h1.classList.add('text-5xl', 'font-extrabold', 'dark:text-white', 'mb-4');
    });

    element.querySelectorAll('h2').forEach(h2 => {
        h2.classList.add('text-4xl', 'font-bold', 'dark:text-white', 'mb-3');
    });

    element.querySelectorAll('h3').forEach(h3 => {
        h3.classList.add('text-3xl', 'font-semibold', 'dark:text-white', 'mb-2');
    });

    element.querySelectorAll('h4').forEach(h4 => {
        h4.classList.add('text-2xl', 'font-medium', 'dark:text-white', 'mb-2');
    });

    element.querySelectorAll('h5').forEach(h5 => {
        h5.classList.add('text-xl', 'font-medium', 'dark:text-white', 'mb-2');
    });

    element.querySelectorAll('h6').forEach(h6 => {
        h6.classList.add('text-lg', 'font-medium', 'dark:text-white', 'mb-2');
    });

    // Styling paragraphs
    element.querySelectorAll('p').forEach(p => {
        p.classList.add('text-base', 'text-gray-700', 'dark:text-gray-300', 'mb-4');
    });

    // Styling blockquotes
    element.querySelectorAll('blockquote').forEach(blockquote => {
        blockquote.classList.add('border-l-4', 'border-gray-300', 'pl-4', 'italic', 'text-gray-600', 'dark:text-gray-400');
    });

    // Styling code blocks
    element.querySelectorAll('pre').forEach(pre => {
        pre.classList.add('bg-gray-900', 'text-white', 'rounded', 'p-4', 'overflow-x-auto', 'mb-4');
    });

    element.querySelectorAll('code').forEach(code => {
        code.classList.add('bg-gray-200', 'text-pink-500', 'rounded', 'px-1', 'py-0.5', 'font-mono', 'text-sm');
    });

    // Styling unordered lists
    element.querySelectorAll('ul').forEach(ul => {
        ul.classList.add('list-disc', 'pl-5', 'mb-4', 'text-base', 'text-gray-700', 'dark:text-gray-300');
    });

    // Styling ordered lists
    element.querySelectorAll('ol').forEach(ol => {
        ol.classList.add('list-decimal', 'pl-5', 'mb-4', 'text-base', 'text-gray-700', 'dark:text-gray-300');
    });

    // Styling links
    element.querySelectorAll('a').forEach(a => {
        a.classList.add('text-blue-500', 'hover:underline', 'dark:text-blue-400');
        a.setAttribute('target', '_blank');
    });

    // Styling images
    element.querySelectorAll('img').forEach(img => {
        img.classList.add('rounded', 'shadow', 'max-w-full', 'h-auto', 'mb-4');
    });
}

function renderPopup(location) {
    return `
        <div class="max-w-sm">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h2 class="text-lg font-bold text-gray-800 mb-1">${location.title}</h2>
                    <p class="text-sm text-gray-600">${location.agency} - ${location.resource_year}</p>
                </div>
                <div class="ml-4 flex-shrink-0">
                    <a href="${location.resource_link}" target="_blank">
                        <img class="shadow-md w-32 h-auto object-cover" src="${location.thumbnail}" alt="${location.title}">
                    </a>
                </div>
            </div>
        </div>
    `;
}


if(document.getElementById("readme")){
//    fetch the text from the README.md file
    fetch('README.md')
        .then(response => response.text())
        .then(text => {
            document.getElementById('readme').innerHTML = marked.parse(text)
            styleMarkdown(document.getElementById('readme'));
        })
        .catch(error => console.error('Error fetching the README.md file:', error));
}

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
                    }).bindPopup(renderPopup(location));

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

            table.classList.add(
                'w-full',
                'border-collapse',
                'border',
                'border-gray-300',
                'divide-y',
                'divide-gray-300',
                'shadow-md',
            );

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

