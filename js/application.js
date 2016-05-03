$(document).ready(function() {
    $("#range").rangeYear();
    $(document).speedSign({
        in_town_sign: "#signs div:nth-child(1)",
        in_town_speed: "#signs div:nth-child(2)",
        out_town_sign: "#signs div:nth-child(3)",
        out_town_speed: "#signs div:nth-child(4)",
        small_highway_sign: "#signs div:nth-child(5)",
        small_highway_speed: "#signs div:nth-child(6)",
        highway_sign: "#signs div:nth-child(7)",
        highway_speed: "#signs div:nth-child(8)",
    });
    $(document).alcoholSign({
        sign: "#signs div:nth-child(9)",
        alcohol: "#signs div:nth-child(10)",
    });
    $(document).on("year-change", function(e, y) {
        $("#year").text(y);
    });
	$("#pichart").pieChart();
});
