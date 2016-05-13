(function($) {
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
        var year_now = Math.round((data.year_from + data.year_to) / 2);
        that.html(input);
        var sliderInput = that.find("input");
        sliderInput.slider({
            tooltip_position: 'bottom',
            tooltip: 'always'
        });
        sliderInput.slider('setValue', year_now);

        var updateValue = function() {
            var value = sliderInput.slider('getValue');
            $(document).trigger("year-change", value);
        };

        sliderInput.slider()
            .on('change', updateValue);

        // trigger manually the change event the first time
        setTimeout(function() {
            updateValue();
        }, 100);
    }
}(jQuery));
