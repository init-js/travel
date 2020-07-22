"use strict";

var geodb = './countries.geo.json';
var geojson;  // geo json layer
var map;      // the leaflet map
var info;     // headsupdisplay
var legend;   // map static legend

var customColors = {
    'Taiwan': '#000095',
    'Canada': '#8b2323',
};


function getColor(feature) {
    var countryName = feature.properties.name;
    var color = customColors[countryName] || "#fff";
    return color;
}

function getStyle(feature) {
    return {
	fillColor: getColor(feature),
	weight: 1,
	opacity: 1,
	color: 'black',
	dashArray: 3,
	fillOpacity: 1,
    }
}

// when clicking a region. reset view.
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function highlightFeature(e) {
    var layer = e.target;

    console.log("highlight:", layer.feature.properties);

    layer.setStyle({
	weight: 3,
	color: '#888',
	dashArray: '',
	fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    if (geojson) {
	geojson.resetStyle(e.target);
    }
    info.update(null);
}

function onEachFeature(feature, layer) {
    layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	//click: zoomToFeature
    });
}

jQuery.fn.outerHTML = function(s) {
    return (s)
	? this.before(s).remove()
	: jQuery("<p>").append(this.eq(0).clone()).html();
}

$.getJSON(geodb,function(data){

    var corner1 = L.latLng(-90, -180),
	corner2 = L.latLng(90, 180),
	bounds = L.latLngBounds(corner1, corner2);

    map = L.map('map', {
	minZoom: 2,
	maxZoom: 5,
	maxBounds: bounds,
    });
    map.setView([20, 0], 3);


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

    L.control.scale().addTo(map);


    info = L.control();

    /* custom control to display regional info */

    info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
    };

    info.update = function (props) {
	if (!props) {
	    this._div.innerHTML = '<h4>Travel Restrictions</h4>' + 'Hover over a region';
	} else {
	    var nameblock = $("<b></b>").text(props.name);
	    this._div.innerHTML = '<h4>Country Info</h4>' + nameblock.outerHTML();
	}
    };

    info.addTo(map);


    legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend');
	var items = [
	    {lbl: 'CAD Ok.',      color: '#8b2323'},
	    {lbl: 'NT$ Ok.',      color: '#000095'},
	    {lbl: 'All Welcome.', color: 'blueviolet'},
	];

	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < items.length; i++) {
	    div.innerHTML +=
		'<i style="background:' + items[i].color + '"></i> ' +
		items[i].lbl + "<br />";
	}

	return div;
    };

    legend.addTo(map);
});
