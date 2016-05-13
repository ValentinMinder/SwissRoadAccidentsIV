$(function () {

    var dest = "#history";
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
    var dataGot = false;
    for (var i = 0; i < datasNames.length; i++) {
        $.getValues(datasNames[i], function (d, n) {
            datas[n] = d;
            got++;
            if (got >= datasNames.length) {
                dataGot = true;
                dataDone();
            }
        });
    }
    function dataDone() {
        if (!dataGot) return;
        var data = [];
        console.log("datas", datas)
        var years = datas.data.year;
        for (var year = datas.settings.year_from; year <= datas.settings.year_to; year++) {
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
            } else  console.log("No pop for ", yearStr)
            if (yearStr in datas.vehicles) {
                data_line.vehicles = datas.vehicles[yearStr].ALL;
            } else console.log("No vhc for ", yearStr)
            data.push(data_line);
        }
        console.log("data", data);
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = $(dest).width() - margin.left - margin.right,
            height = $(dest).width()*0.3 - margin.top - margin.bottom;

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

        var xYear = function (d) {
            return x(d.year);
        };
        x.domain([datas.settings.year_from, datas.settings.year_to]);
        y.domain([0, d3.max(data, function (d) {
            return d.deads;
        })]);
        $(dest).html("");
        var svg = d3.select(dest).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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

        addLine(svg, data, xYear, function(d) {
            return y(d.alcohol * 1000);
        }, "line_alcohol");
        addLine(svg, data, xYear, function(d) {
            return y(d.deads);
        }, "line_deads");
        addLine(svg, data, xYear, function(d) {
            return y(d.deads / (d.populations * 0.0000005));
        }, "line");
        addLine(svg, data, xYear, function(d) {
            return y(d.deads / (d.vehicles * 0.0000005));
        }, "line");
    }
    $(window).resize(function() {
        dataDone();
    });
    function addLine(svg, data, x, y, klass) {
        var line = d3.svg.line()
            .x(x)
            .y(y);
        svg.append("path")
            .datum(data)
            .attr("class", klass)
            .attr("d", line);
    }
});