mapboxgl.accessToken = 'pk.eyJ1IjoiZWhsNyIsImEiOiJjbG9vdHd5c3gwMWttMmpuMGp4ZWxlamUzIn0.wYyVzZnzVph_EMghQUhLWQ';

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    zoom: 14, // starting zoom
    center: [-122.30426195303225, 47.6555430824661] // starting center47.6555430824661, -122.30426195303225
});

async function geojsonFetch() {
    let response, trees, uw, table;
    response = await fetch('assets/trees120.geojson');
    trees = await response.json();
    response = await fetch('assets/uw_campus.geojson');
    uw = await response.json();

    //load data to the map as new layers and table on the side.
    map.on('load', function loadingData() {

        map.addSource('uw', {
            type: 'geojson',
            data: uw
        });

        map.addLayer({
            'id': 'uw-layer',
            'type': 'fill',
            'source': 'uw',
            'paint': {
                'fill-color': '#0080ff', // blue color fill
                'fill-opacity': 0.5
            }
        });

        map.addSource('trees', {
            type: 'geojson',
            data: trees
        });

        map.addLayer({
            'id': 'trees-layer',
            'type': 'circle',
            'source': 'trees',
            'paint': {
                'circle-radius': 6,
                'circle-stroke-width': 1,
                'circle-color': 'green',
                'circle-stroke-color': 'white'
            }
        });

    });

    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3;
    for (let i = 0; i < trees.features.length; i++) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell1.innerHTML = trees.features[i].properties.OBJECTID;
        cell2.innerHTML = trees.features[i].properties.Hgt_Q99;
        cell3.innerHTML = trees.features[i].properties.Type;
    }
};

geojsonFetch();

let btn = document.getElementsByTagName("button")[0];

btn.addEventListener('click', sortTable);

// define the function to sort table
// define the function to sort table
function sortTable(e) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementsByTagName("table")[0];
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = parseFloat(rows[i].getElementsByTagName("td")[1].innerHTML);
            y = parseFloat(rows[i + 1].getElementsByTagName("td")[1].innerHTML);
            //check if the two rows should switch place:
            if (x < y) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}