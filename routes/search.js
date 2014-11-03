
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
      var resp = {status:200, data:{results:[]}};
      request.get(
        'http://api.lillycoi.com/v1/trials/search.json?query=cond:' + req.body.searchText + ',count=100', {},
        function(error, response, body) {
           if(error) {
             resp = {status: 500, data: error};
             res.render('home', {resp: resp});
           }
           else {
            var data = JSON.parse(body);
            console.log('data.length ' + data.results.length);
             resp = {status:200, data:data};
             res.render('home', {resp:resp});
           }
      });
      console.log('Resp.data' || resp.data);
      res.render('home' , {resp:resp});
    };
    app.post('/search', search);
}
