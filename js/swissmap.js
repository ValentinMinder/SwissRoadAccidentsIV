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

    var map = L.map('swissmap', {
            maxZoom: 10,
            minZoom: 3
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
            console.log("max canton victims: " + max_canton_victims);
            $.getValues('ch-cantons', addTopoData);
        });
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
        return `
            <div class="row popup-body">
                <div class="col-xs-12">
                    <img src="img/flags/${abbr}.svg" height="50" />
                    <span class="popup-flag-title">${abbr}</span>

                </div>
                <div class="col-sm-12">
                    <ul>
                        <li>Total : ${cantonStats["total"]}</li>
                        <li>Morts : ${cantonStats["dead"]}</li>
                        <li>Sévèrement blessés : ${cantonStats["seriously_injured"]}</li>
                        <li>Légèrement blessés : ${cantonStats["lightly_injured"]}</li>
                    </ul>
                </div>
            </div>`;
    }

    $("input[name=map_layer]:radio").on('change', function() {
        victims_type = $('input[name=map_layer]:checked', '#swissmap_controls_form').val();
        updateMap();
    });

}());
