// source: https://gist.github.com/moklick/c1cc83e18a6fafd9af81#file-index-html
(function() {
    'use strict'

    var jsonData;
    var max_canton_victims = -1
    var year;

    var map = L.map('swissmap', {
            maxZoom: 10,
            minZoom: 3
        }),
        topoLayer = new L.TopoJSON(),
        colorScale = chroma
        .scale(['#E8F6FA', '#20C0F5'])
        .domain([0, 1]);

    map.setView([46.77, 8.2], 7.5); // center of Switzerland

    $(document).on("year-change", function(e, y) {
        year = "_" + y; // add prefix for json data

        $.getJSON("data/data.json").done(function(data) {
            jsonData = data;
            max_canton_victims = jsonData.stats["max_canton_dead_victims"]

            $.getJSON('data/ch-cantons.json').done(addTopoData);
        });
    });

    function getCantonData(abbr, year) {
        var toReturn;
        $.each(jsonData.year[year].regions, function(i, region) {
            $.each(region.cantons, function(cantonName, cantonStats) {
                if (cantonName == abbr) {
                    toReturn = cantonStats;
                    return false;
                }
            });
        });
        return toReturn;
    }

    function addTopoData(topoData) {
        topoLayer.clearLayers();
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        topoLayer.eachLayer(handleLayer);
    }

    function handleLayer(layer) {
        var canton = layer.toGeoJSON().properties.abbr
        var cantonData = getCantonData(canton, year);
        var cantonColor = cantonData["dead"] / max_canton_victims;
        var fillColor = colorScale(cantonColor).hex();

        layer.setStyle({
            fillColor: fillColor,
            fillOpacity: 1,
            color: '#555',
            weight: 1,
            opacity: .5
        });
        layer.on({
            // mouseover: enterLayer,
            click: clickLayer
                // mouseout: leaveLayer
        });
    }

    function enterLayer() {
        var countryName = this.feature.properties.name;

        this.bringToFront();
        this.setStyle({
            weight: 2,
            opacity: 1
        });
    }

    function leaveLayer() {
        this.bringToBack();
        this.setStyle({
            weight: 1,
            opacity: .5
        });
    }

    function clickLayer() {
        var clickedCanton = this.feature.properties.abbr;
        var cantonStats = getCantonData(clickedCanton, year);
        var msg = clickedCanton + ": " + JSON.stringify(cantonStats);
        this.bindPopup("<div>" + msg + "</div>", {
            maxWidth: "none"
        });
    }
}());
