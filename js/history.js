$(function() {

    

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatDate = d3.time.format("%d-%b-%y");

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(d3.format("f"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line_alcohol = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.alcohol * 1000);
        });
    var line_deads = d3.svg.line()
        .x(function (d) {
            return x(d.year);
        })
        .y(function (d) {
            return y(d.deads);
        });
    var svg = d3.select("#history").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var datasNames = [
        "alcohol",
        "data",
        "population",
        "settings",
        "speed",
        "vehicles",
    ];
    var datas = {};
    var got = 0;
    for(var i = 0 ; i < datasNames.length ; i++) {
        $.getValues(datasNames[i], function(d, n) {
            datas[n] = d;
            got++;
            if (got >= datasNames.length) {
                dataDone();
            }
        });
    }
    function dataDone() {
        var data = [];
        var years = datas.data.year;
        for (var year = datas.settings.year_from ; year <= datas.settings.year_to ; year++) {
            var yearStr = "" + year;
            var data_line = {
                year: parseInt(yearStr),
                deads: years["_" + yearStr].dead,
                alcohol: datas.alcohol[yearStr].alcohol,
                populations: 0,
                vehicles: 0,
            };
            if (yearStr in datas.population) {
                data_line.populations = datas.population[yearStr].ALL;
            }
            if (yearStr in datas.vehicles) {
                data_line.vehicles = datas.vehicles[yearStr].ALL;
            }
            /*
             populations: datas.population[yearStr].ALL,
             vehicles: datas.vehicles[yearStr].ALL,
            */
            data.push(data_line);
        }
        x.domain([datas.settings.year_from, datas.settings.year_to]);
        y.domain([0, d3.max(data, function (d) {
            return d.deads;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            ;

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

        svg.append("path")
            .datum(data)
            .attr("class", "line_alcohol")
            .attr("d", line_alcohol);

        svg.append("path")
            .datum(data)
            .attr("class", "line_deads")
            .attr("d", line_deads);
    };
});