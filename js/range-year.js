(function( $ ) {

    $.fn.rangeYear = function(options) {
        var settings = $.extend({
            // These are the defaults.
            from: 1900,
            to: 2016
        }, options );
        console.log("a", settings);
        console.log("b", settings.to);
        this.html('<input type="range" value="'+settings.to+'" min="'+settings.from+'" max="'+settings.to+'"class="form-control"/>');
        this.on("change", "input", function() {
            console.log("Change year to", $(this).val());
        })
    };

    $.fn.closePopup = function() {
        // Close popup code.
    };

}( jQuery ));