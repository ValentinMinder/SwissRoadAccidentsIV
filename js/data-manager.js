(function( $ ) {
    var files = [
        "ch-cantons",
        "colors",
        "data",
        "population",
        "speed",
        "settings",
        "vehicles",
    ];
    var datas = {};
    var waitings = {};
    var arrays = {};
    $.getValues = function(name, callback) {
        if (datas[name]) {
            callback(datas[name], name);
            return;
        }
        if (files.indexOf(name) < 0) throw "Invalid file name " + name;
        if (name in waitings) {
            waitings[name].push(callback);
            return;
        }
        waitings[name] = [callback];
        $.getJSON("data/" + name + ".json", function(d) {
            datas[name] = d;
            for (var i in waitings[name]) {
                waitings[name][i](d, name);
            }
            waitings[name] = undefined;
        });
    };
    $.getArray = function(name, callback) {
        if (arrays[name]) {
            callback(arrays[name], name);
            return;
        }
        $.getValues(name, function(data) {
            var ar = [];
            for (var k in data) {
                data[k].year = parseInt(k);
                ar.push(data[k])
            }
            arrays[name] = ar;
            callback(ar, name)
        })
    }
}( jQuery ));