// source: https://gist.github.com/moklick/c1cc83e18a6fafd9af81#file-index-html
(function() {
    'use strict'

    var jsonData;

    var map = L.map('swissmap', {
            maxZoom: 10,
            minZoom: 3
        }),
        topoLayer = new L.TopoJSON(),
        $countryName = $('.country-name'),
        colorScale = chroma
        .scale(['#E8F6FA', '#20C0F5'])
        .domain([0, 1]);

    map.setView([46.77, 8.2], 7.5); // center of Switzerland
    $.getJSON('data/ch-cantons.json').done(addTopoData);


    $.getJSON("data/data.json", function(data) {
        jsonData = data;
    });


    function addTopoData(topoData) {
        topoLayer.addData(topoData);
        topoLayer.addTo(map);
        topoLayer.eachLayer(handleLayer);
    }

    function handleLayer(layer) {
        var randomValue = Math.random(),
            fillColor = colorScale(randomValue).hex();

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
        $countryName.text(countryName).show();

        this.bringToFront();
        this.setStyle({
            weight: 2,
            opacity: 1
        });
    }

    function leaveLayer() {
        $countryName.hide();
        this.bringToBack();
        this.setStyle({
            weight: 1,
            opacity: .5
        });
    }

    function clickLayer() {
        var clickedCanton = this.feature.properties.abbr;
        console.log("clic: " + clickedCanton);

        console.log(this.feature.properties);
        console.log(jsonData.year._1994);
        //console.log(jsonData["1994"].dead);

        $.each(jsonData.year._1994.regions, function(i, region) {
            $.each(region.cantons, function(cantonName, cantonStats) {
                console.log("count: " + Object.keys(region).length);
                console.log(cantonName + " " + JSON.stringify(cantonStats));

                if (cantonName == clickedCanton) {
                    $countryName.text(cantonName + ": " + JSON.stringify(cantonStats)).show();
                }
            });

        });
    }
}());
