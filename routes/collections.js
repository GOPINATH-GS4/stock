module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // collections.js
    // Author: Janakiraman Gopinath 
    //
    var collections = function(req, res) {
      
      ctcModel.UserCollections.find({email:'gopinathjmad@gmail.com'}, function(err, collections) {
        utils.writeResponse(req, res, collections);
      });

    };
    app.post('/collection', collections);
    app.get('/collection', collections);
    app.get('/collection/*', collections);
}
