// source: https://gist.github.com/moklick/c1cc83e18a6fafd9af81#file-index-html
(function() {
    'use strict'

    var jsonData;
    var max_canton_victims = -1
    var year;

    // victims type (dead, seriously or lightly injured) and layers colors
    var victims_type = $('input[name=map_layer]:checked', '#swissmap_controls_form').val();
    var victims_colors = {
        "dead": "#000",
        "seriously_injured": "#FF0000",
        "lightly_injured": "#FFB300"
    };
    var template = null;
    $.get("templates/swissmap-popup.html", function(data) {
        template = data;
        Mustache.parse(template)
    });

    var map = L.map('swissmap', {
            maxZoom: 9,
            minZoom: 7,
            maxBounds: [
                [45.175325, 4.064941],
                [48.232967, 12.524414]
            ]
        }),
        topoLayer = new L.TopoJSON();

    map.setView([46.77, 8.2], 7.5); // center of Switzerland

    $(document).on("year-change", function(e, y) {
        year = "_" + y; // add prefix for json data

        updateMap();
    });

    function updateMap() {
        $.getValues("data", function(data) {
            jsonData = data;

            switch (victims_type) {
                case "dead":
                    max_canton_victims = jsonData.stats["max_canton_dead_victims"];
                    break;

                case "seriously_injured":
                    max_canton_victims = jsonData.stats["max_canton_seriously_victims"];
                    break;

                case "lightly_injured":
                    max_canton_victims = jsonData.stats["max_canton_lightly_victims"];
                    break;
            }

            updateLegend();

            $.getValues('ch-cantons', addTopoData);
        });
    }

    function updateLegend() {
        var max_hue = victims_colors[victims_type],
            colorScale = chroma
            .scale(['#E8F6FA', max_hue])
            .domain([0, 1]);

        var legend = L.control({
            position: 'bottomright'
        });

        legend.onAdd = function(map) {
            // remove legend if previously created
            if ($("#legend") != undefined) {
                $("#legend").remove();
            }
            var div = document.createElement("div");
            div.id = "legend";
            div.className += "legend info";
            var grades = new Array();
            var length = 10;
            for (var i = 0; i < length; i++) {
                grades[i] = Math.round(i * 0.1 * max_canton_victims);
            }

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colorScale((grades[i] + 1) / max_canton_victims) + '"></i> ' +
                    (grades[i] + 1) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);
    }

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
        map.closePopup();
        topoLayer.clearLayers();
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        topoLayer.eachLayer(handleLayer);
    }

    function handleLayer(layer) {
        var canton = layer.toGeoJSON().properties.abbr
        var cantonData = getCantonData(canton, year);
        var cantonColor = cantonData[victims_type] / max_canton_victims;

        var max_hue = victims_colors[victims_type],
            colorScale = chroma
            .scale(['#E8F6FA', max_hue])
            .domain([0, 1]);
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
        this.bindPopup(getPopupContent(clickedCanton, cantonStats), {
            maxWidth: "none"
        });
    }

    function getPopupContent(abbr, cantonStats) {
        return Mustache.render(template, {
            "abbr": abbr,
            "cantonStats": cantonStats,
        });
    }

    $("input[name=map_layer]:radio").on('change', function() {
        victims_type = $('input[name=map_layer]:checked', '#swissmap_controls_form').val();
        updateMap();
    });

}());
