(function( $ ) {
    $.fn.alcoolSign = function(options) {
        var settings = $.extend({
            years: [
                {
                    to:2005,
                    src: "img/alcool/0.8.svg"
                },
                {
                    to:Infinity, // and beyond!
                    src: "img/alcool/0.5.svg"
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
