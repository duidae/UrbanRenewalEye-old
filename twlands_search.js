var http = require("http");
var https = require("https");

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
function getLandJSON(a, b, c, onResult) {
    //http://twland.ronny.tw/index/search?lands[]=臺北市,華興段三小段,141
    var options = {
        host: 'twland.ronny.tw',
        port: 80,
        // path: '/index/search?lands[]=%E8%87%BA%E5%8C%97%E5%B8%82,%E8%8F%AF%E8%88%88%E6%AE%B5%E4%B8%89%E5%B0%8F%E6%AE%B5,141',
        path: '/index/search?lands[]=' + encodeURIComponent(a) + ',' + encodeURIComponent(b) + ',' + encodeURIComponent(c),
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log("rest::getJSON");

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function (res) {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function (err) {
        //res.send('error: ' + err.message);
        console.log('error')
    });

    req.end();
};



getLandJSON('臺北市', '華興段三小段', '141', function (statusCode, result) {
    // I could work with the result html/json here.  I could also just return it
    console.log("onResult: (" + statusCode + ")\n" + JSON.stringify(result.features[0].geometry.coordinates[0][0], null, 2));

    var polygon = [];
    var coords = result.features[0].geometry.coordinates[0][0];
    for (var i = 0; i < coords.length; i++) {
        // console.log(coords[i]);
        polygon[i] = {
            lat: coords[i][1],
            lng: coords[i][0]
        };
    }

    console.log(JSON.stringify(polygon, null, 2))

    // res.statusCode = statusCode;
    // res.send(result);
});