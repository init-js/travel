"use strict";

var myGeoJSONPath = './countries.geo.json';
var myCustomStyle = {
    stroke: true,
    fill: true,
    fillColor: '#fff',
    fillOpacity: 1
}

$.getJSON(myGeoJSONPath,function(data){
    var map = L.map('map');
    map.setView([0, 0], 1);

    if (!map.isFullScreen()) {
	map.toggleFullscreen();
    }

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

    L.geoJson(data, {
	clickable: false,
	style: myCustomStyle
    }).addTo(map);

});
