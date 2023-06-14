// Initialize leaflet.js
var L = require('leaflet');
var apiCalls = []; //array for api calls, gets filled over time and displayed on index.html
var uniqueApiCalls = []; //array for unique api calls, implements a counter for each api host container
var apiHost = 'http://localhost:8081';
console.log(apiHost);

// Initialize the map
var map = L.map('map', {
	scrollWheelZoom: false
});

// Set the position and zoom level of the map 
map.setView([53.57, 10.01], 9);

/*	Variety of base layers */
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var osm_bw_mapnik = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; OSM Black and White Mapnik<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var osm_de = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; OSM Deutschland <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Create base layers group object
var baseLayers = {
	"OSM Mapnik": osm_mapnik,
	"OSM Black White Mapnik": osm_bw_mapnik,
	"OSM Germany": osm_de,
};

//plz= all PLZ from data/plz-5stellig.geojson 
var plzData = [];
for (var i = 0; i <= 9; i++) {
	var obj = { type: "FeatureCollection", features: [] };
	plzData.push(obj);
}

//split and generate features
plz.features.forEach(function (element) {
	for (var k = 0; k <= 9; k++) {
		//console.log(element.properties.plz);
		var n = k.toString();
		if (element.properties.plz.startsWith(n)) {
			plzData[k].features.push(element);
			break;
		}
	}
});

//generate Layer
var plzGeoJsonLayer = [];
for (var i = 0; i <= 9; i++) {
	plzGeoJsonLayer[i] = L.geoJson(plzData[i], {
		style: style,
		onEachFeature: onEachFeature
	});
}

//activate on layer 2 on start
plzGeoJsonLayer[2].addTo(map);

//add to controls
var overLayers = {
	"PLZ 0": plzGeoJsonLayer[0],
	"PLZ 1": plzGeoJsonLayer[1],
	"PLZ 2": plzGeoJsonLayer[2],
	"PLZ 3": plzGeoJsonLayer[3],
	"PLZ 4": plzGeoJsonLayer[4],
	"PLZ 5": plzGeoJsonLayer[5],
	"PLZ 6": plzGeoJsonLayer[6],
	"PLZ 7": plzGeoJsonLayer[7],
	"PLZ 8": plzGeoJsonLayer[8],
	"PLZ 9": plzGeoJsonLayer[9]
}

L.control.layers(baseLayers, overLayers).addTo(map);

// Create control that shows information on hover
var info = L.control({ position: 'topright' });

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props, weight) {
	this._div.innerHTML = '<p><b>Zip </b></p>' + (props ?
		'<b>' + props.plz + '</b><br /> Total weight of all shipments to this area: ' + weight + ' kg'
		: 'Hover over a district');
};
info.addTo(map);


/* Set of function for the hover over the geojson layer */
function style(feature) {
	return {
		weight: 2,
		opacity: 0.7,
		color: 'grey',
		dashArray: '2',
		fillOpacity: 0.0,
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#277FCA',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	loadData(e);

}

var geojson;

function resetHighlight(e) {
	for (var propertyName in overLayers) {
		overLayers[propertyName].resetStyle(e.target);
	}
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}
function loadData(e) {
	$.ajax({
		url: apiHost + "/shipments/to/" + e.target.feature.properties.plz,
		dataType: 'json',
		crossDomain: true,
		context: e,
		type: 'GET',
		success: function (data, textStatus, jqXHR) {
			info.update(e.target.feature.properties, aggregateData(data));
			var apiCall = {
				url: jqXHR.getResponseHeader('X-API-Container'), // get the url of the API call from the response header, this is the url the loadbalancers called
				time: new Date().toISOString() // includes date and time with milliseconds
			};
			updateUniqueApiCalls(apiCall.url); // update the unique API calls count
			apiCalls.unshift(apiCall); // use unshift to add the new call to the beginning of the array so they appear on top in the table (makes it easier to see new calls)
			displayApiCalls(apiCall); // update the displayed API calls
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("Error: " + textStatus + " " + errorThrown);
		}
	});
}

function displayApiCalls(call) {
	var table = document.getElementById('api-calls-table');
	var row = table.insertRow(1); // Insert the row just after the header
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell1.textContent = call.url;
	cell2.textContent = call.time;
}



function updateUniqueApiCalls(apiContainerURL) {
	var url = new URL(apiContainerURL);

	// remove the API path, leave only the host 
	var server = url.origin;

	// try to find the call in the uniqueApiCalls array
	var call = uniqueApiCalls.find(c => c.url === server);

	if (call) {
		// if it's found, increment the count
		call.count++;
		displayUniqueApiCalls();
	} else {
		var newCall = {
			url: server,
			count: 1
		};
		uniqueApiCalls.push(newCall);
		displayUniqueApiCalls();
	}
}

function displayUniqueApiCalls() {
	var table = document.getElementById('unique-api-calls-table');
	// first, clear all rows except the header
	while (table.rows.length > 1) {
		table.deleteRow(1);
	}

	// Then, add a row for each unique API call
	uniqueApiCalls.forEach(function (call) {
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.textContent = call.url;
		cell2.textContent = call.count;
	});
}

function aggregateData(data) {
	var sumWeight = 0;
	data.forEach(item => sumWeight += item.Weight);
	return parseFloat(sumWeight).toPrecision(5);
}
