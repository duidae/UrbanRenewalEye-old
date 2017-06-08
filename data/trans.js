const fs = require('fs');
var input = require('./private_renewal_units_info.json');
var results = {};

input.map(function (o) {
    results[o.id] = o;
});
fs.writeFile('private_renewal_units_info_dictionary.json', JSON.stringify(results, null, 2), function (err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log('done');
    }
});