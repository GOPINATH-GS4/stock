module.exports = function(app, stock, constants, utils, log) {
    // 
    // index.js
    //
    var index = function(req, res) {
        res.render('index');
    };
    app.get('/', index);
}