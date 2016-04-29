$(document).ready(function() {
    $("#msgid").html("This is Hello World by JQuery");
    $("#range").rangeYear();
    $(document).speedSign({
        in_town_sign: "#sign div:nth-child(1)",
        in_town_speed: "#sign div:nth-child(2)",
        out_town_sign: "#sign div:nth-child(3)",
        out_town_speed: "#sign div:nth-child(4)",
        small_highway_sign: "#sign div:nth-child(5)",
        small_highway_speed: "#sign div:nth-child(6)",
        highway_sign: "#sign div:nth-child(7)",
        highway_speed: "#sign div:nth-child(8)",
    });
    $("#alcool").alcoolSign();
});
