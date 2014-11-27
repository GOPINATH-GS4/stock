module.exports = function(app, constants, utils, log) {
    // 
    // drone.js
    // Author: Janakiraman Gopinath 
    //
    var drone = function(req, res) {
        // fetch all the collections for the user and display card
        res.render('drone', {});

    };
    app.get('/drone', drone);
}