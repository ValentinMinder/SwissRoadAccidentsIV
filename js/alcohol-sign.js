(function( $ ) {
    function get_image_html(name, src) {
        return '<img class="img-responsive" alt="' + name + '" src="' + src + '" />'
    }
    $.fn.alcoholSign = function(options) {
        var settings = $.extend({
            sign: null,
            alcohol: null,
        }, options );
        var data = null;
        var year = null;
        $.getJSON("data/alcohol.json", function(d) {
            data = d;
            changeImages();
        });
        $(settings.sign).html(get_image_html("alchool_sign", "/img/alcohol/sign.svg"));
        $(settings.alcohol).html(get_image_html("alcohol", ""));
        $(document).on("year-change", function(e, y) {
            if (!data) return;
            year = y;
            changeImages();
        });
        function changeImages() {
            if (!data) return;
            if (!year) return;
            var d = data[year+""];
            $(settings.alcohol).find("img").attr("src", "/img/alcohol/" + d.alcohol + ".svg");
        }
    };
}( jQuery ));
