$(document).ready(function() {
    $(document).on("year-change", function(e, y) {
        $("#year-title").text(y);
    });
    $("#pichart").pieChart();
    $("#law-periods").lawPeriod();
    $(".panel-heading").badasPanels()
    $("#range").rangeYear();
});
