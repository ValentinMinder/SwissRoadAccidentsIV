(function( $ ) {
    $.fn.rangeYear = function() {
        var that = this;
        var template = null;
        var data = null;
        $.getValues("settings", function(d) {
            data = d;
            createRange(that, data, template);
        });
        $.get("templates/range-year.html", function(t) {
            template = t;
            createRange(that, data, template);
        })
    };
    function createRange(that, data, template) {
        if (!data) return;
        if (!template) return;
        var input = $(Mustache.render(template, data));
        input.val((data.year_from + data.year_to) / 2);
        that.html(input);
        input.change(function() {
            $(document).trigger("year-change",  $(this).val());
        });
        setTimeout(function() {
            input.change();
        }, 100);
    }
}( jQuery ));