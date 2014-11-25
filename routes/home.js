// Drop this route after implementing login 
//
module.exports = function(app, constants, utils, log) {
    // 
    // File: login.js
    // Author: Janakiraman Gopinath 
    //
    var home = function(req, res) {
        res.render('home');
    };
    app.get('/home', home);
}