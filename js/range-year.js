(function( $ ) {
    $.fn.rangeYear = function(options) {
        var settings = $.extend({
            // These are the defaults.
            from: 1970,
            to: 2016
        }, options );
        console.log("a", settings);
        console.log("b", settings.to);
        var input = $('<input type="range" value="'+(settings.to + settings.from)/2+'" min="'+settings.from+'" max="'+settings.to+'"class="form-control"/>');
        this.html(input);
        input.change(function() {
            $(document).trigger("year-change",  $(this).val());
        });
        setTimeout(function() {
            input.change();
        }, 100);
    };
}( jQuery ));