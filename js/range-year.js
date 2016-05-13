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

        var year_now = Math.round((data.year_from + data.year_to) / 2);
        data.year_now = year_now;

        var input = $(Mustache.render(template, data));

        that.html(input);
        var sliderInput = that.find("input");
        sliderInput.slider();
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
