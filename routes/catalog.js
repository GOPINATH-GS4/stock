module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // index.js
    // Author: Janakiraman Gopinath 
    //
    var catalog = function(req, res) {

        var userNameCookie = utils.getCookie(req, 'ctcUsername');
        var userIdCookie = utils.getCookie(req, 'ctcUser_id');

        if (userNameCookie.exists && userIdCookie.exists) {
            utils.isLoggedIn(req, res, function(logIn) {
                if (!logIn.exists) {
                    res.render('signin');
                } else {
                    console.log(utils.util.inspect(userNameCookie));
                    console.log(utils.util.inspect(userIdCookie));
                    res.render('catalog', {
                        username: userNameCookie.value,
                        userId: userIdCookie.value
                    });
                }
            });
        } else {
            res.render('signin');
        }
    };
    app.get('/catalog', catalog);
}