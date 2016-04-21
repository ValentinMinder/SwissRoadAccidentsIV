(function( $ ) {

    $.fn.speedSign = function(options) {
        var settings = $.extend({
            years: [
                {
                    to:1983,
                    src: "img/speed/-1983.svg"
                },
                {
                    to:1988,
                    src: "img/speed/1984-1988.svg"
                },
                {
                    to:100000,
                    src: "img/speed/1989-.svg"
                }
            ]
        }, options );
        var that = this;
        $(document).on("year-change", function(e, year) {
            for (var i = 0 ; i < settings.years.length ; i++) {
                var y = settings.years[i];
                if (year <= y.to) {
                    that.attr("src", y.src);
                    break;
                }
            }
        })
    };

}( jQuery ));
