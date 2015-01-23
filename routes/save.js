module.exports = function(app, ctcModel, constants, utils, request, log) {

    /*
     * This method is used to save the data to the database and return the Key columns
     */
    function saveIDData(nctid, resp, callback) {
        link = 'http://api.lillycoi.com/v1/trials/' + nctid + '.json';
        console.log('Link ' + link);
        request.get({
            url: link
        }, function(error, response, body) {
            if (error) {
                resp = {
                    status: 500,
                    message: error
                };
            } else {
                var data = JSON.parse(body);
                var keys = {
                    nctid: nctid,
                    VersionDate: data.results[0].lastchanged_date.value
                };
                ctcModel.CtcNctids.count({
                    nctid: nctid,
                    VersionDate: data.results[0].lastchanged_date.value
                }, function(err, count) {
                    if (err) {
                        resp = {
                            status: 500,
                            message: err
                        };
                        utils.writeResponse(req, res, resp);
                    }
                    if (count) {
                        resp = {
                            status: 200,
                            message: 'Success'
                        };
                        callback(null, resp, keys);
                    } else {
                        // Creating the model for saving the record
                        var ctcNctids = new ctcModel.CtcNctids({
                            nctid: nctid,
                            VersionDate: data.results[0].lastchanged_date.value,
                            data: data.results[0],
                            InsertDate: new Date()
                        });
                        // Save the model to database
                        ctcNctids.save(function(err) {
                            if (err) {
                                resp = {
                                    status: 500,
                                    message: err
                                };
                                callback(null, resp, null);
                            } else {
                                resp = {
                                    status: 200,
                                    message: 'Success'
                                };
                                //console.log('NCITID ' + nctid + ' saved.');
                                callback(null, resp, keys);
                            }
                        });
                    }
                });
            }
        });
    }

    /*
     * This method is used to refresh the data of existing NCT ID of a collection
     */
    var refreshCollection = function(req, res) {
        /* req.body = {
			userId : '11',
			collectionName : 'collection',
			nctids : ['NCT01646047']
		};*/
        //var nctids = [];
        switch (req.method) {
            case 'POST':
                var userid = req.body.userId,
                    collectionName = req.body.collectionName;
                nctids = req.body.nctids;
                // Update Staleness flag to stale and start refresh process
                ctcModel.UserCollections.update({
                        UserId: userid,
                        CollectionName: collectionName,
                        nctids: {
                            $elemMatch: {}
                        }
                    }, {
                        $set: {
                            "nctids.$.Staleness": "Stale"
                        }
                    },
                    function(err) {
                        if (err) {
                            resp = {
                                status: 500,
                                message: err
                            };
                            utils.writeResponse(req, res, resp);
                        }
                    });
                //                var fun = function (err, callback) {
                //                    var log = _.bind(console.log, console);
                //                    _.delay(log, 10000, 'logged later');                
                //                    callback;
                //                }
                for (var i = 0; i < nctids.length; i++) {
                    saveIDData(
                        nctids[i],
                        res,
                        function(err, resp, keys) {
                            // Check if latest version available in the database
                            ctcModel.UserCollections.count({
                                UserId: userid,
                                CollectionName: collectionName,
                                nctids: {
                                    $elemMatch: {
                                        nctid: keys.nctid,
                                        VersionDate: keys.VersionDate
                                    }
                                }
                            }, function(err, count) {
                                if (err) {
                                    resp = {
                                        status: 500,
                                        message: err
                                    };
                                    utils.writeResponse(req, res, resp);
                                } else {
                                    if (count) {
                                        // If latest version is available in the database, return the control
                                        resp = {
                                            status: 200,
                                            message: 'Success'
                                        };
                                        utils.writeResponse(req, res, resp);
                                    } else {
                                        // If latest version is not available in the database, check if old version record is available.
                                        ctcModel.UserCollections.count({
                                                UserId: userid,
                                                CollectionName: collectionName,
                                                nctids: {
                                                    $elemMatch: {
                                                        nctid: keys.nctid
                                                    }
                                                }
                                            },
                                            function(err, count) {
                                                if (err) {
                                                    console.log('handle error 22');
                                                    resp = {
                                                        status: 500,
                                                        message: err
                                                    };
                                                    utils.writeResponse(req, res, resp);
                                                    //callback(null, resp, null);
                                                } else {
                                                    if (count) {
                                                        ctcModel.UserCollections.update({
                                                                UserId: userid,
                                                                CollectionName: collectionName,
                                                                nctids: {
                                                                    $elemMatch: {
                                                                        nctid: keys.nctid
                                                                    }
                                                                }
                                                            }, {
                                                                $set: {
                                                                    "nctids.$.VersionDate": keys.VersionDate,
                                                                    "nctids.$.Staleness": 'Fresh'
                                                                }
                                                            },
                                                            function(err) {
                                                                if (err) {
                                                                    resp = {
                                                                        status: 500,
                                                                        message: err
                                                                    };
                                                                    utils.writeResponse(req, res, resp);
                                                                    //callback(null, resp, null);
                                                                } else {
                                                                    resp = {
                                                                        status: 200,
                                                                        message: 'Success'
                                                                    };
                                                                    console.log('NCITID ' + keys.nctid + ' saved.');
                                                                    utils.writeResponse(req, res, resp);
                                                                    //callback(null, resp, null);
                                                                }
                                                            });
                                                    } else {
                                                        resp = {
                                                            status: 500,
                                                            message: 'NCTID ' + keys.nctid + ' data is not available to refresh'
                                                        };
                                                        utils.writeResponse(req, res, resp);
                                                        //callback(null, resp, null);
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                        });
                }
                break;
        }

    };

    /*
     * This method is used to add NCT ID to a collection
     */
    var addToCollection = function(req, res) {
        /* console.log("Entered");
		req.body = {
				userId : '11',
					collectionName : 'collection',
					nctid : 'NCT01646047'
			};*/

        switch (req.method) {
            case 'POST':
                var userid = req.body.userId,
                    collectionName = req.body.collectionName,
                    nctid = req.body.nctid;
                saveIDData(
                    req.body.nctid,
                    res,
                    function(err, resp, keys) {
                        //console.log('Keys ' + keys.nctid + '   ' + keys.VersionDate);
                        //Check if data available for input Collection + NCTID version
                        ctcModel.UserCollections.count({
                                UserId: userid,
                                CollectionName: collectionName,
                                nctids: {
                                    $elemMatch: {
                                        nctid: keys.nctid,
                                        VersionDate: keys.VersionDate
                                    }
                                }
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
                                            message: 'Data is up to date for Collection : ' + collectionName + ' NCTID : ' + keys.nctid
                                        };
                                        utils.writeResponse(req, res, resp);
                                    } else {

                                        // If latest version is not available in the database, check if old version record is available.
                                        ctcModel.UserCollections.count({
                                                UserId: userid,
                                                CollectionName: collectionName,
                                                nctids: {
                                                    $elemMatch: {
                                                        nctid: keys.nctid
                                                    }
                                                }
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
                                                        ctcModel.UserCollections.update({
                                                                UserId: userid,
                                                                CollectionName: collectionName,
                                                                nctids: {
                                                                    $elemMatch: {
                                                                        nctid: keys.nctid
                                                                    }
                                                                }
                                                            }, {
                                                                $set: {
                                                                    "nctids.$.VersionDate": keys.VersionDate,
                                                                    "nctids.$.Staleness": 'Fresh'
                                                                }
                                                            },
                                                            function(err) {
                                                                if (err) {
                                                                    resp = {
                                                                        status: 500,
                                                                        message: err
                                                                    };
                                                                    utils.writeResponse(req, res, resp);
                                                                } else {
                                                                    resp = {
                                                                        status: 200,
                                                                        message: 'Latest NCTID version overwritten successfully.'
                                                                    };
                                                                    utils.writeResponse(req, res, resp);
                                                                }
                                                            });
                                                    } else {
                                                        // If there is no version available for NCTID, add latest version in to collection
                                                        ctcModel.UserCollections.count({
                                                                UserId: userid,
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
                                                                        ctcModel.UserCollections.update({
                                                                                UserId: userid,
                                                                                CollectionName: collectionName
                                                                            }, {
                                                                                $addToSet: {
                                                                                    nctids: {
                                                                                        nctid: keys.nctid,
                                                                                        VersionDate: keys.VersionDate,
                                                                                        InsertDate: new Date(),
                                                                                        Staleness: 'Fresh'
                                                                                    }
                                                                                }
                                                                            },
                                                                            function(err) {
                                                                                if (err) {
                                                                                    resp = {
                                                                                        status: 500,
                                                                                        message: err
                                                                                    };
                                                                                    utils.writeResponse(req, res, resp);
                                                                                } else {
                                                                                    resp = {
                                                                                        status: 200,
                                                                                        message: 'NCTID (' + keys.nctid + ') added successfully in to the collection.'
                                                                                    };
                                                                                    utils.writeResponse(req, res, resp);

                                                                                }
                                                                            });
                                                                    } else {
                                                                        resp = {
                                                                            status: 500,
                                                                            message: 'Collection doesn not exists to add NCTID.'
                                                                        };
                                                                        utils.writeResponse(req, res, resp);
                                                                    }
                                                                }
                                                            });

                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                    });
                break;
        }
    };
    app.post('/refreshCollection', refreshCollection);
    app.post('/addToCollection', addToCollection);

};