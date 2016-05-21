function toogleVisibility() {
    var panelHeading = $(this).parent();
    var btn = panelHeading.find(":button");

    var panelBody = panelHeading.next();
    var animationTime = 500;

    if (panelHeading.attr("data-showed") == 1) {
        panelHeading.attr("data-showed", 0);
        panelBody.hide(animationTime);

        btn.val($("<span>").html("&#x25ba;").text());
    } else {
        panelHeading.attr("data-showed", 1);
        panelBody.show(animationTime);

        btn.val($("<span>").html("&#x25bc;").text());
    }
}

function makePanelsHideable() {
    $(".panel-heading").attr("data-showed", 1);

    var btn = $('<input class="pull-right" type="button" value="&#x25bc;"/>'); // black down-pointing triangle
    btn.on("click", toogleVisibility);

    $(".panel-heading").append(btn);
}
