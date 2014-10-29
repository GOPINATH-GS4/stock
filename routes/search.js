
module.exports = function(app, stock, constants, utils, log) {
    // 
    // search.js
    // Author: Janakiraman Gopinath 
    //
    var request = require('request');
    var search = function(req, res) {
      console.log('Body : ' + utils.util.inspect(req.body));
      // 1. make a call to lilly coi 
      // 2. 
      console.log('Body : ' + 
        'http://api.lillycoi.com/v1/trials/search.json?query=cond:' + req.body.searchText);
      var x = {};
      request.get(
        'http://api.lillycoi.com/v1/trials/search.json?query=cond:' + req.body.searchText + ',count=100', {},
        function(error, response, body) {
           var resp = JSON.parse(body);

           console.log('Number of studies for ' + req.body.searchText  + ' = '  + resp.results.length);
           if(error) {
             x = {status: 500, data: error};
           }
           else {
             x = {status:200, data:response.body};
           }
      });
      res.render('home' , x);
    };
    app.post('/search', search);
}
