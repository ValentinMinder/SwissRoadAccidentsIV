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

        var year_count = data.year_to - data.year_from;

        data.year_range = Array.apply(null, Array(year_count + 1)).map(function(_, i) {
            return (i + data.year_from);
        });

        data.year_range = JSON.stringify(data.year_range);

        var input = $(Mustache.render(template, data));

        that.html(input);

        var stepSlider = document.getElementById('range-year-slider');

        function highlightBigYears(value, type) {
            // show changing years in big, X0's in small, hide all others
            var v = 2; // default don't show
            if ($.inArray(value, data.bigYears) !== -1) {
                v = 1;
            } else if (value % 10) {
                v = 0;
            }
            return v;
        }
        noUiSlider.create(stepSlider, {
            start: [data.year_now],
            step: 1,
            range: {
                'min': [data.year_from],
                'max': [data.year_to]
            },
            pips: {
                mode: 'steps',
                filter: highlightBigYears,
                density: 3
            }
        });

        var updateValue = function() {
            var value = Math.round(stepSlider.noUiSlider.get());
            $(document).trigger("year-change", value);
        };

        stepSlider.noUiSlider.on('update', function(values, handle) {
            updateValue();
        });
    }
}(jQuery));
