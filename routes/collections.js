module.exports = function (app, ctcModel, constants, utils, log) {
    //
    // collections.js
    // Author: Janakiraman Gopinath
    //
    var collections = function (req, res) {

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
                    ctcModel.UserCollections.find(userId, function (err, collections) {
                        utils.writeResponse(req, res, collections);
                    });
                }
                break;

            case 'POST':
                var userId;
                var collectionName;
                var resp = {};

                // Check if request has collection name and userid  .. https://localhost/save/collection/userid
                console.log(req.path);
                console.log(req.path.split('/', 3).pop());
                console.log(req.path.split('/', 4).pop());
                if ((req.path.split('/', 3).pop() !== 'save' && req.path.split('/', 3).pop() !== '') &&
                    (req.path.split('/', 3).pop() !== req.path.split('/', 4).pop() && req.path.split('/', 4).pop() !== '')) {

                    userId = req.path.split('/', 4).pop();
                    collectionName = req.path.split('/', 3).pop();
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
                                        status: 500,
                                        message: 'This collection already exists.'
                                    };
                                    utils.writeResponse(req, res, resp);                                                		
                        	} else {
                        		console.log('Saving data for userId : ' + userId + ' Collection :' + collectionName);
                                var userCollection = new ctcModel.UserCollections({
                                	UserId: userId,
                                    CollectionName: collectionName
                                });
                                userCollection.save(function (err) {
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
                    		status: 500,
                    		message: 'Invalid Request'
                    };
                    utils.writeResponse(req, res, resp);
                }
                break;
        }
    };
    app.post('/save', collections);
    app.post('/save/*', collections);
    app.get('/collection', collections);
    app.get('/collection/*', collections);
}
