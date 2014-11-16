module.exports = function(app, constants, utils, log) {
    // 
    // index.js
    // Author: Janakiraman Gopinath 
    //
    var index = function(req, res) {
        res.render('index', {
            info: {
                'title': 'Login'
            }
        });
    };
    app.get('/', index);
}