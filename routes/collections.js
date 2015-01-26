module.exports = function(app, ctcModel, constants, utils, log) {
    //
    // collections.js
    // Author: Janakiraman Gopinath
    //
    var collections = function(req, res) {

        switch (req.method) {

            case 'GET':
                var userId = {};
                console.log(req.path.split('/').pop());
                if (req.path.split('/').pop() === 'collection') {
                    resp = {
                        status: 500,
                        message: 'Invalid Request'
                    };
                    utils.writeResponse(req, res, resp);
                } else {
                    userId.UserId = req.path.split('/').pop();
                    console.log('fetching data for  ' + utils.util.inspect(userId));
                    ctcModel.UserCollections.find(userId, function(err, collections) {
                        utils.writeResponse(req, res, collections);
                    });
                }
                break;

            case 'PUT':
                var userId = req.path.split('/').pop();
                console.log('User Id : ' + userId);
                console.log(req.body);
                var collectionName = req.body.collectionName;
                console.log('Collection name : ' + collectionName);


                ctcModel.UserCollections.remove({
                    UserId: userId,
                    CollectionName: collectionName
                }, function(err) {
                    console.log(err);
                });


                utils.writeResponse(req, res, constants.SUCCESS);
                break;

            case 'POST':
                var collectionName;
                var resp = {};

                // Check if request has collection name and userid  .. https://localhost/save/collection/userid
                console.log(req.path);
                console.log(req.body);

                var userId = req.body.u;

                var collectionName = req.body.collectionName;

                console.log(userId);
                console.log(collectionName);

                if (typeof collectionName != 'undefined' || collectionName != null) {

                    ctcModel.UserCollections.count({
                            UserId: userId,
                            CollectionName: collectionName
                        },
                        function(err, count) {
                            if (err) {
                                resp = {
                                    status: 500,
                                    message: err
                                };
                                utils.writeResponse(req, res, resp);
                            } else {
                                if (count) {
                                    resp = {
                                        status: 200,
                                        message: 'This collection already exists.'
                                    };
                                    utils.writeResponse(req, res, resp);
                                } else {
                                    console.log('Saving data for userId : ' + userId + ' Collection :' + collectionName);
                                    var userCollection = new ctcModel.UserCollections({
                                        UserId: userId,
                                        CollectionName: collectionName
                                    });
                                    userCollection.save(function(err) {
                                        if (err) {
                                            resp = {
                                                status: 500,
                                                message: err
                                            };
                                            utils.writeResponse(req, res, resp);
                                        } else {
                                            resp = {
                                                status: 200,
                                                message: 'Success'
                                            };
                                            utils.writeResponse(req, res, resp);
                                        }
                                    });
                                }
                            }
                        });
                } else {
                    resp = {
                        status: 200,
                        message: 'Invalid Request'
                    };
                    utils.writeResponse(req, res, resp);
                }
                break;
        }
    };
    app.post('/collection', collections);
    app.get('/collection', collections);
    app.get('/collection/*', collections);
    app.put('/collection/*', collections);
}