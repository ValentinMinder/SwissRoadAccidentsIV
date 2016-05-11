(function( $ ) {
    function get_image_html(name, src) {
        return '<img class="img-responsive" alt="' + name + '" src="' + src + '" />'
    }
    $.fn.speedSign = function(options) {
        var settings = $.extend({
            in_town_sign: null,
            in_town_speed: null,
            out_town_sign: null,
            out_town_speed: null,
            small_highway_sign: null,
            small_highway_speed: null,
            highway_sign: null,
            highway_speed: null,
        }, options );
        var data = null;
        var year = null;
        $.getValues("speed", function(d) {
            data = d;
            changeImages();
        });
        $(settings.in_town_sign).html(get_image_html("in_town_sign", "/img/speed/in_town.svg"));
        $(settings.out_town_sign).html(get_image_html("in_town_sign", "/img/speed/out_town.svg"));
        $(settings.small_highway_sign).html(get_image_html("in_town_sign", "/img/speed/small_highway.svg"));
        $(settings.highway_sign).html(get_image_html("in_town_sign", "/img/speed/highway.svg"));
        $(settings.in_town_speed).html(get_image_html("in_town_sign", ""));
        $(settings.out_town_speed).html(get_image_html("out_town_speed", ""));
        $(settings.small_highway_speed).html(get_image_html("small_highway_speed", ""));
        $(settings.highway_speed).html(get_image_html("highway_speed", ""));
        $(document).on("year-change", function(e, y) {
            if (!data) return;
            year = y;
            changeImages();
        });
        function changeImages() {
            if (!data) return;
            if (!year) return;
            var d = data[year+""];
            console.log("d");
            $(settings.in_town_speed).find("img").attr("src", "/img/speed/" + d.in_town + ".svg");
            $(settings.out_town_speed).find("img").attr("src", "/img/speed/" + d.out_town + ".svg");
            $(settings.small_highway_speed).find("img").attr("src", "/img/speed/" + d.small_highway + ".svg");
            $(settings.highway_speed).find("img").attr("src", "/img/speed/" + d.highway + ".svg");
        }
    };
}( jQuery ));
