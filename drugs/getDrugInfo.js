var request = require('request');
var _ = require('underscore');

var skipCounter = 0;
var limitValue = 100;

var getDrugs = function(skip,limit, callback) {
    console.log('Making request: SKIP: ' + skip + ' LIMIT: ' + limit);
    request.get(
        'https://api.fda.gov/drug/label.json?&skip=' + skip + '&limit=' + limit, {},
        function(error, response, body) {
          var openfda  = JSON.parse(body);

          skipCounter += openfda.results.length;

          _.each(openfda.results, function(x) {

            if(typeof x.openfda.generic_name != 'undefined') 
              console.log(x.openfda.generic_name);
          });

          callback(skipCounter, openfda.results.length != limit);

        });
};
var drugcallback = function(skip, exit) {
    
    if(!exit)  getDrugs(skip , limitValue , drugcallback);
};
   
getDrugs(skipCounter,limitValue, drugcallback);
