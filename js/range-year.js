(function( $ ) {
    $.fn.rangeYear = function() {
        var that = this;
        $.getValues("settings", function(data) {
            var input = $('<input type="range" value="'+(data.year_to + data.year_from)/2+'" min="'+data.year_from+'" max="'+data.year_to+'"class="form-control"/>');
            that.html(input);
            input.change(function() {
                $(document).trigger("year-change",  $(this).val());
            });
            setTimeout(function() {
                input.change();
            }, 100);
        });
    };
}( jQuery ));