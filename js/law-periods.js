(function($) {
    $.fn.lawPeriod = function() {
        var that = this;
        var template = null;
        var data = null;

        $.getValues("settings", function(d) {
            data = d;
            renderPeriods(that, data, template);
        });
        $.get("templates/law-period.html", function(t) {
            template = t;
            renderPeriods(that, data, template);
        })

        $(document).on("year-change", function(e, y) {
            if (!data) return;

            // trim first and last year
            var changingYears = data.bigYears.slice(1, data.bigYears.length - 1);

            // get current period
            var period = 0;
            for (var i = 0; i < changingYears.length; i++) {
                if (y >= changingYears[i]) {
                    period++;
                }
            }

            // highlight current period
            $("#law-periods div").removeClass("highlight-period");
            $("#law-periods > div:eq(" + period + ")").addClass("highlight-period");

        });
    };

    function renderPeriods(that, data, template) {
        if (!data) return;
        if (!template) return;

        data.laws = [{
            year_from: 1975,
            year_to: 1983,
            in_town: "unlimited",
            out_town: "unlimited",
            small_highway: "unlimited",
            highway: "unlimited",
            alcohol_sign: 0.8
        }, {
            year_from: 1984,
            year_to: 1988,
            in_town: 50,
            out_town: "unlimited",
            small_highway: "unlimited",
            highway: "unlimited",
            alcohol_sign: 0.8
        }, {
            year_from: 1989,
            year_to: 2005,
            in_town: 50,
            out_town: 80,
            small_highway: 100,
            highway: 120,
            alcohol_sign: 0.8
        }, {
            year_from: 2006,
            year_to: 2014,
            in_town: 50,
            out_town: 80,
            small_highway: 100,
            highway: 120,
            alcohol_sign: 0.5
        }];
        var input = $(Mustache.render(template, data));
        var lawPeriods = $("#law-periods");
        that.html(input);
    }
}(jQuery));
