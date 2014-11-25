module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // collections.js
    // Author: Janakiraman Gopinath 
    //
    var collections = function(req, res) {

        console.log('Path = ' + req.path.split('/').pop());

        var email = {};

        if (req.path.split('/').pop() === 'collection')
            email = {};
        else
            email = req.path.split('/').pop();


        ctcModel.UserCollections.find(email, function(err, collections) {
            utils.writeResponse(req, res, collections);
        });

    };
    app.post('/collection', collections);
    app.get('/collection', collections);
    app.get('/collection/*', collections);
}