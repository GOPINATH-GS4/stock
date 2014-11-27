module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // collections.js
    // Author: Janakiraman Gopinath 
    //
    var collections = function(req, res) {

        var userId = {};

        if (req.path.split('/').pop() === 'collection')
            userId = {};
        else
            userId.userId = req.path.split('/').pop();

        console.log('fetching data for  ' + utils.util.inspect(userId));

        ctcModel.UserCollections.find(userId, function(err, collections) {
            utils.writeResponse(req, res, collections);
        });

    };
    app.post('/collection', collections);
    app.get('/collection', collections);
    app.get('/collection/*', collections);
}