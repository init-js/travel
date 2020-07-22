"use strict";

var geodb = './countries.geo.json';
var geojson;

var myCustomStyle = {
    stroke: true,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
}

function getColor(feature) {
    return "#fff";
}

function getStyle(feature) {
    return {
	fillColor: getColor(feature),
	weight: 2,
	opacity: 1,
	color: 'black',
	dashArray: 3,
	fillOpacity: 1,
    }
}

function highlightFeature(e) {
    // mouse event
    var layer = e.target;

    console.log(layer);
    layer.setStyle({
	weight: 5,
	color: '#666',
	dashArray: '',
	fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	layer.bringToFront();
    }
}

function resetHighlight(e) {
    if (geojson) {
	geojson.resetStyle(e.target);
    }
}

// when clicking a region. reset view.
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	//click: zoomToFeature
    });
}

$.getJSON(geodb,function(data){
    var map = L.map('map');
    map.setView([0, 0], 4);

    // https://github.com/Leaflet/Leaflet.fullscreen
    map.addControl(new L.Control.Fullscreen({
	title: {
	    'false': 'View Fullscreen',
	    'true': 'Exit Fullscreen'
	}
    }));

    map.on('fullscreenchange', function () {
	if (map.isFullscreen()) {
	    console.log('entered fullscreen');
	} else {
	    console.log('exited fullscreen');
	}
    });

    geojson = L.geoJson(data, {
	style: getStyle,
	onEachFeature: onEachFeature,
    }).addTo(map);

});
