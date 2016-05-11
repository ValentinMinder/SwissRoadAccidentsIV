(function( $ ) {
    var files = [
        "alcohol",
        "ch-cantons",
        "data",
        "population",
        "speed",
        "vehicles",
        "years",
    ];
    var datas = {};
    var arrays = {}
    $.getValues = function(name, callback) {
        if (datas[name]) {
            callback(datas[name], name);
            return;
        }
        if (files.indexOf(name) < 0) throw "Invalid file name " + name;        
        $.getJSON("data/" + name + ".json", function(d) {
            datas[name] = d;
            callback(d, name);
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
            console.log("ar", ar);
            arrays[name] = ar;
            callback(ar, name)
        })
    }
}( jQuery ));