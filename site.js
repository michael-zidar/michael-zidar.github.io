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
        h1.classList.add('text-5xl', 'font-extrabold', 'dark:text-white', 'mb-4', 'border-b-2', 'border-gray-300', 'dark:border-gray-700', 'pb-2');
    });

    element.querySelectorAll('h2').forEach(h2 => {
        h2.classList.add('text-4xl', 'font-bold', 'dark:text-white', 'mb-3', 'border-b-2', 'border-gray-300', 'dark:border-gray-700', 'pb-2');
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

function renderGuide(guide) {

    //  if the thumbnail is not available, use a placeholder image default.png
    if (!guide.thumbnail || guide.thumbnail === '' || guide.thumbnail === 'default.png') {
        guide.thumbnail = './thumbnails/default.png';
    }

    let link = '';
    // if the resource_link is available and ends with .pdf 
    if (guide.resource_link && guide.resource_link.endsWith('.pdf')) {
        link = `<a href="${guide.resource_link}" target="_blank" class="text-blue-500 hover:underline dark:text-blue-400">View PDF</a>`;
    } else if (guide.source_url) {
        link = `<a href="${guide.source_url}" target="_blank" class="text-blue-500 hover:underline dark:text-blue-400">View Resource</a>`;
    }

    return `
    <div class="mb-4 p-4 bg-white dark:bg-gray-800 rounded shadow" id="${guide.id}">
        <div class="flex justify-between items-start">
            <div class="flex-1">
                <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-1">${guide.title}</h2>
                <p class="text-sm text-gray-600 dark:text-gray-400">${guide.resource_year}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">${guide.author}</p>
                ${link}
            </div>
            <div class="ml-4 flex-shrink-0">
                <a href="${guide.source_url}" target="_blank"><img class="shadow-md w-32 h-auto object-cover" src="${guide.thumbnail}" alt="${guide.title}"></a>
            </div>
        </div>
    </div>
`;
}


if (document.getElementById("readme")) {
    //    fetch the text from the README.md file
    fetch('README.md')
        .then(response => response.text())
        .then(text => {
            document.getElementById('readme').innerHTML = marked.parse(text)
            styleMarkdown(document.getElementById('readme'));
        })
        .catch(error => console.error('Error fetching the README.md file:', error));
}

if (document.getElementById("divCoreConcepts")) {
    // read the data from the content.json file and exclude anything that is that does not have a resource_type
    fetch('data/content.json')
        .then(response => response.json())
        .then(data => {
            let content = data.filter(location => location.resource_type);
            // filter the data by resource type and order them alphabetically
            let core_concepts = content.filter(location => location.resource_type == 'Foundational Resource').sort((a, b) => a.title.localeCompare(b.title));
            let response_guides = content.filter(location => location.resource_type == 'Response Guide').sort((a, b) => a.title.localeCompare(b.title));
            let problem_guides = content.filter(location => location.resource_type == 'Problem Guide').sort((a, b) => a.title.localeCompare(b.title));
            let tool_guides = content.filter(location => location.resource_type == 'Tool Guide').sort((a, b) => a.title.localeCompare(b.title));

            let divCoreConcepts = document.getElementById('divCoreConcepts');
            let divResponseGuides = document.getElementById('divResponseGuides');
            let divProblemGuides = document.getElementById('divProblemGuides');
            let divToolGuides = document.getElementById('divToolGuides');

            core_concepts.forEach(guide => {
                let div = document.createElement('div');
                div.innerHTML = renderGuide(guide);
                divCoreConcepts.appendChild(div);
            });

            response_guides.forEach(guide => {
                let div = document.createElement('div');
                div.innerHTML = renderGuide(guide);
                divResponseGuides.appendChild(div);
            });

            problem_guides.forEach(guide => {
                let div = document.createElement('div');
                div.innerHTML = renderGuide(guide);
                divProblemGuides.appendChild(div);
            });

            tool_guides.forEach(guide => {
                let div = document.createElement('div');
                div.innerHTML = renderGuide(guide);
                divToolGuides.appendChild(div);
            });

            let search = document.getElementById('search');

            search.addEventListener('input', () => {
                let value = search.value.toLowerCase();
                let all_guides = [...core_concepts, ...response_guides, ...problem_guides, ...tool_guides];
                all_guides.forEach(guide => {
                    let div = document.getElementById(guide.id);
                    if (guide.title.toLowerCase().includes(value) || guide.author.toLowerCase().includes(value)) {
                        div.parentElement.classList.remove('hidden');
                        div.classList.remove('hidden');
                        div.classList.remove('mb-0'); 
                    } else {
                        div.parentElement.classList.add('hidden');

                        div.classList.add('hidden');
                        div.classList.add('mb-0'); 
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching the data:', error));
}

if (document.getElementById('map')) {

    let map = L.map('map', { minZoom: 2, maxZoom: 16 }).setView([37.96, -62.25], 2);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    let markers = L.markerClusterGroup();
    let markerMap = {};
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

                    marker._leaflet_id = location.id;
                }
            });

            map.addLayer(markers);

            let table = document.getElementById('table');

            data.forEach(location => {
                if (location.latitude || location.longitude) {
                    let row = table.insertRow(-1);
                    let title = row.insertCell(0);
                    let agency = row.insertCell(1);
                    let agency_location = row.insertCell(2);
                    let year = row.insertCell(3);

                    title.innerHTML = location.title;
                    agency.innerHTML = location.agency;
                    agency_location.innerHTML = location.location;
                    year.innerHTML = location.resource_year;
                    // set the row id to the location.id
                    row.id = location.id;
                }
            });

            // Add an event listener for the table rows
            let rows = document.querySelectorAll('#table tr');
            rows.forEach(row => {
                row.classList.add('h-12', 'px-4', 'text-align-left', 'angle-middle', 'font-sm', 'text-muted-foreground');
                row.classList.add('transition', 'duration-200', 'hover:bg-gray-100');

                let cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.classList.add('mt-4', 'text-sm', 'text-muted-foreground');
                });
                row.addEventListener('click', () => {
                    let title = row.cells[0].innerHTML;
                    let location = content_json.find(location => location.title === title);
                    if (location && location.latitude && location.longitude) {
                        markers.zoomToShowLayer(markerMap[title], () => {
                            markerMap[title].openPopup();
                        });
                    }
                });
            });

            // Add an event listener for the search input
            let search = document.getElementById('search');
            search.addEventListener('input', () => {
                let value = search.value.toLowerCase();
                rows.forEach(row => {
                    // skip the header row
                    if (row.rowIndex === 0) return;

                    let title = row.cells[0].innerHTML.toLowerCase();
                    let agency = row.cells[1].innerHTML.toLowerCase();
                    let location = row.cells[2].innerHTML.toLowerCase();
                    let year = row.cells[3].innerHTML.toLowerCase();

                    if (title.includes(value) || agency.includes(value) || location.includes(value) || year.includes(value)) {
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

        })
        .catch(error => console.error('Error fetching the data:', error));

    let chart_one_options = {
        series: [{
            data: [61, 53, 32, 24, 22, 22, 20, 18, 17, 16, 16, 15]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        colors: ['#111827'],
        plotOptions: {
            bar: {
                borderRadius: 1,
                borderRadiusApplication: 'end',
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        title: {
            text: 'Top Agencies by Number of Projects',
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#111827'
            }
        },
        xaxis: {
            categories: ['San Diego Police Department', 'Lancashire Constabulary', 'Metropolitan Police Service', 'Charlotte-Mecklenburg Police Department', 'Durham Constabulary', 'Cleveland Police', 'Los Angeles Police Department', 'Washington State Patrol', 'Fresno Police Department', 'Phoenix Police Department', 'Kansas City Police Department', 'South Yorkshire Police'
            ],
        }
    };

    let chart_two_options = {
        series: [838, 215, 48, 13, 12, 4, 3],
        chart: {
            type: 'donut',
            height: 350
        },
        labels: ['United States', 'United Kingdom', 'Canada', 'All Other', 'New Zealand', 'Chile', 'Norway'],
        theme: {
            monochrome: {
                enabled: true,
                color: '#111827',
            },
        },
        title: {
            text: 'Submissions by Country',
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#111827'
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 350
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    let chart1 = new ApexCharts(document.querySelector("#chart_top_agencies"), chart_one_options);
    chart1.render();

    let chart2 = new ApexCharts(document.querySelector("#chart_submissions_by_county"), chart_two_options);
    chart2.render();
}