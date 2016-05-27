$(function () {
    'use strict';

    var MODE_NOMBRE = 1;
    var MODE_PER_POP = 2;
    var MODE_PER_VHC = 3;
    var dest = "#history";
    var mode = MODE_NOMBRE;
    var datasNames = [
        "data",
        "population",
        "settings",
        "speed",
        "vehicles",
    ];
    var datas = {};
    var got = 0;
    var dataGot = false;
    var data = null;
    var current_year = null;
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
    var template = null;
    var trads = null;
    var div = d3.select("body").append("div")
        .attr("id", "history_tooltip")
        .attr("class", "leaflet-popup-content-wrapper")
        .style("opacity", 0);
    $.get("templates/history-form.html", function(t) {
        template = t;
        drawLegend();
    });
    $.getValues("helpers/injury", function (d) {
        trads = d;
        drawLegend();
    });
    $(document).on("year-change", function(e, y) {
        current_year = y;
        dataDone();
    });
    function drawLegend() {
        if (!template) return;
        if (!trads) return;
        var d = {
            legend_width: 40,
            legend_height: 10,
            legend_half_height: 5,
            legends: [
                {
                    name: trads.dead.fr,
                    class: "line_deads",
                },
                {
                    name: trads.lightly_injured.fr,
                    class: "line_lightly_injureds",
                },
                {
                    name: trads.seriously_injured.fr,
                    class: "line_seriously_injureds",
                },
                {
                    name: "Année courante",
                    class: "line_current_year",
                },
                {
                    name: "Changements législatifs",
                    class: "line_law_change",
                },
            ]
        };
        $(dest).before($(Mustache.render(template, d)));
        $('input:radio[name="history_choice"]').change(function() {
            var radio = $('input:radio[name="history_choice"]:checked');
            mode = parseInt(radio.val());
            dataDone();
        })
    }
    
    function dataDone() {
        if (!current_year) return;
        if (!dataGot) return;
        if (!data) {
            var data = [];
            var years = datas.data.year;
            var last_line = null;
            for (var year = datas.settings.year_from; year <= datas.settings.year_to; year++) {
                var yearStr = "" + year;
                var yLocal = years["_" + yearStr];
                var data_line = {
                    year: parseInt(yearStr),
                    deads: yLocal.dead,
                    seriously_injureds: yLocal.seriously_injured,
                    lightly_injureds: yLocal.lightly_injured,
                    populations: datas.population[yearStr].ALL,
                    vehicles: datas.vehicles[yearStr].ALL,
                };
                var pop = data_line.populations * 0.001;
                var vhc = data_line.vehicles * 0.001;
                data_line.dead_by_pop = data_line.deads / pop;
                data_line.dead_by_vhc = data_line.deads / vhc;
                data_line.seriously_injured_by_pop = data_line.seriously_injureds / pop;
                data_line.seriously_injured_by_vhc = data_line.seriously_injureds / vhc;
                data_line.lightly_injured_by_pop = data_line.lightly_injureds / pop;
                data_line.lightly_injured_by_vhc = data_line.lightly_injureds / vhc;
                data.push(data_line);
                last_line = data_line;
            }
        }
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
        var text = "";
        switch (mode) {
            case MODE_NOMBRE:
                y.domain([0, d3.max(data, function (d) {
                    return Math.max(d.deads, d.seriously_injureds, d.lightly_injureds);
                })]);
                text = "Nombre";
                break;
            case MODE_PER_POP:
                y.domain([0, d3.max(data, function (d) {
                    return Math.max(d.dead_by_pop, d.seriously_injured_by_pop, d.lightly_injured_by_pop);
                })]);
                text = "Nombre par millier d'habitant";
                break;
            case MODE_PER_VHC:
                y.domain([0, d3.max(data, function (d) {
                    return Math.max(d.dead_by_vhc, d.seriously_injured_by_vhc, d.lightly_injured_by_vhc);
                })]);
                text = "Nombre par millier de vehicule";
                break;
        }

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
            .text(text);

        switch (mode) {
            case MODE_NOMBRE:
                addLine("deads", "line_deads");
                addLine("seriously_injureds", "line_seriously_injureds");
                addLine("lightly_injureds", "line_lightly_injureds");
                break;
            case MODE_PER_POP:
                addLine("dead_by_pop", "line_deads");
                addLine("seriously_injured_by_pop", "line_seriously_injureds");
                addLine("lightly_injured_by_pop", "line_lightly_injureds");
                break;
            case MODE_PER_VHC:
                addLine("dead_by_vhc", "line_deads");
                addLine("seriously_injured_by_vhc", "line_seriously_injureds");
                addLine("lightly_injured_by_vhc", "line_lightly_injureds");
                break;
        }
        addVerticalLine(current_year, "line_current_year");
        // normal to start at 1, skip first
        for (var i = 1 ; i < datas.speed.length ; i++) {
            addVerticalLine(datas.speed[i].year_from, "line_law_change");
        }
        function addLine(yData, klass) {
            var line = d3.svg.line()
                .x(xYear)
                .y(function(d) {
                    return y(d[yData]);
                });
            svg.append("path")
                .datum(data)
                .attr("class", klass)
                .attr("d", line)
                .on("mouseover", function(data) {
                    var value = null;
                    var year = parseInt(x.invert(d3.event.pageX-margin.left));
                    for (var i = 0 ; i < data.length ; i++) {
                        if (data[i].year == year) {
                            value = data[i][yData];
                        }
                    }
                    if (value % 1 !== 0) value = value.toFixed(2);
                    div.html(year + " : " + value)
                        .style("left", (d3.event.pageX - 2) + "px")
                        .style("top", (d3.event.pageY - margin.top - 2) + "px")
                        .style("opacity", .9);
                })
                .on("mouseout", function(d) {
                    div.style("opacity", 0)
                });
        }
        function addVerticalLine(year, klass) {
            var xValue = x(year);
            svg.append("line")
                .attr("x1", xValue)  //<<== change your code here
                .attr("y1", 0)
                .attr("x2", xValue)  //<<== and here
                .attr("y2", height)
                .attr("class", klass)
        }
    }
    $(window).resize(function() {
        dataDone();
    });
});
