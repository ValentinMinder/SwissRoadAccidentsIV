(function( $ ) {
    'use strict';

    var animationTime = 500;
    var attr = "data-showed";
    var textOpen = $("<span>").html("&#x25bc;").text();
    var textClosed = $("<span>").html("&#x25ba;").text();
    var btn = $('<input class="pull-right btn btn-default" style="padding: 1px 4px;" type="button" value="' + textOpen + '"/>'); // black down-pointing triangle
    btn.on("click", function () {
        var panelHeading = $(this).parent();
        var btn = panelHeading.find(":button");
        var panelBody = panelHeading.next();
        if (panelHeading.attr(attr) == 1) {
            panelHeading.attr(attr, 0);
            panelBody.hide(animationTime);
            btn.val(textClosed);
        } else {
            panelHeading.attr(attr, 1);
            panelBody.show(animationTime);
            btn.val(textOpen);
        }
    });

    $.fn.badasPanels = function () {
        return this.attr(attr, 1).append(btn);
    };
}( jQuery ));