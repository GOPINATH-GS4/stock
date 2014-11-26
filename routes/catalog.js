module.exports = function(app, constants, utils, log) {
    // 
    // index.js
    // Author: Janakiraman Gopinath 
    //
    var catalog = function(req, res) {
        res.render('catalog');
    };
    app.get('/catalog', catalog);
}