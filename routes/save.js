module.exports = function(app, ctcModel, constants, utils, request, log) {


	/*
	 * This method is used to save the data to the database and return the Key columns
	 */
	function SaveIDData(nctid, resp, callback) {
	    link = 'http://api.lillycoi.com/v1/trials/' + nctid + '.json';
	    console.log('Link ' + link);
	    request.get({
	        url: link
	    }, function (error, response, body) {
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
	            }, function (err, count) {
	                if (err) {
	                    resp = {
	                        status: 500,
	                        message: err
	                    };
	                    utils.writeResponse(req, res, resp);	                    
	                }
	                if (count) {
	                    console.log('Data is up to date for NCTID : ' + nctid);
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
	                    ctcNctids.save(function (err) {
	                        if (err) {
	                            resp = {
	                                status: 500,
	                                message: err
	                            };
	                            callback(null, resp, null);
	                        } else {
	                            resp = {
	                                status: 200,
	                                message: 'success'
	                            };
	                            console.log('NCITID ' + nctid + ' saved.');
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
	var RefreshCollection = function (req, res) {
		/*req.body = {
			userId : '10',
			collectionName : 'FirstCollection',
			nctids : ['NCT01646047']
		};*/
		//var nctids = [];
		switch (req.method) {
        	case 'POST':
				var	userid = req.body.userId,
					collectionName = req.body.collectionName;
				    nctids = req.body.nctids;
			    for (var i = 0; i < nctids.length; i++) {
			        SaveIDData(	
			        	nctids[i],
			        	res,
			        	function (err, resp, keys) {
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
			        		},function (err, count) {
			        			if (err) {
			        				console.log('handle error 2 ' + err);
			        				resp = {
			        						status: 500,
			        						message: err
			        				};
			        				utils.writeResponse(req, res, resp);
			        				//callback(null, resp, null);
			        			} else {
			        				// If latest version is available in the database, return the control
			        				console.log('elese 1'); // delete
			        				if (count) {
			        					console.log('Data is up to date for Collection : ' + collectionName + ' NCTID : ' + keys.nctid);
			        					resp = {
			        							status: 200,
			        							message: 'Success'
			        					};
			        					utils.writeResponse(req, res, resp);
			        					//callback(null, resp, null);
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
			        					function (err,count) {
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
			        								},
			        								{
			        									$set: {
			        										"nctids.$.VersionDate": keys.VersionDate
			        									}
			        								},
			        								function (err) {
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
			        												message: 'success'
			        										};
			        										console.log('NCITID ' + keys.nctid + ' saved.');
			        										utils.writeResponse(req, res, resp);
			        										//callback(null, resp, null);
			        									}
			        								});
			        							} else {
			        								resp = {
			        										status: 500,
			        										message: 'NCTID data is not available to refresh'
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
	var AddToCollection = function (req, res) {
		/*console.log("Entered");
		req.body = {
				userId : '10',
					collectionName : 'FirstCollection',
					nctid : 'NCT01646047'
			};*/

		switch (req.method) {
    		case 'POST':
				var userid = req.body.userId,
					collectionName = req.body.collectionName,
					nctid = req.body.nctid;
				//console.log("Inside POST CASE");
			    SaveIDData(
			    	req.body.nctid,
			        res,
			        function (err, resp, keys) {
			            console.log(' Keys ' + keys.nctid + '   ' + keys.VersionDate);
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
			             function (err, count) {
			            	 console.log('Count Add 1  ' + count);
			            	 if (err) {
			            		 console.log('handle error 2');
			            		 resp = {
			            			status: 500,
			            			message: err
			                        };
			            		 utils.writeResponse(req, res, resp);   
			            		 //callback(null, resp, null);
			                  } else {
			                	  if (count) {
			                		  console.log('Data is up to date for Collection : ' + collectionName + ' NCTID : ' + keys.nctid);
			                		  resp = {
			                				  status: 200,
			                				  message: 'Success'
			                          };
			                		  utils.writeResponse(req, res, resp);
			                		  //callback(null, resp, null);
			                      } else {
			                    	  console.log('userid ' + userid + collectionName)
			                    	  ctcModel.UserCollections.count({
			                    		  UserId: userid,
			                    		  CollectionName: collectionName
			                    	  },
			                    	  function (err, count) {
			                    		  console.log('Count Add 2  ' + count);
			                    		  if (err) {
			                    			  console.log('handle error 2');
			                    			  resp = {
			                    					  status: 500,
			                    					  message: err
			                    			  };
			                    			  utils.writeResponse(req, res, resp);
			                    			  //callback( null,resp,null);
			                               } else {
			                            	   if (count) {
			                            		   ctcModel.UserCollections.update({
			                            			   UserId: userid,
			                            			   CollectionName: collectionName
			                            		   },
			                            		   {
			                            			   $addToSet: {
			                            				   nctids: {
			                            					   nctid: keys.nctid,
			                            					   VersionDate: keys.VersionDate,
			                            					   InsertDate: new Date()
			                            				   }
			                            			   }
			                            		   },
			                            		   function (err) {
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
			                            						   message: 'success'
			                            				   };
			                            				   console.log('NCITID ' + keys.nctid + ' saved.');
														   utils.writeResponse(req, res, resp);
			                               	            	//callback(null, resp, null);
			                            			   }
			                            		   });
			                            	   } else {
			                            		   //console.log('step 8 ' + userid + '  ' + collection);
			                            		   var userCollection = new ctcModel.UserCollections(
			                            				   {
			                            					   UserId: userid,
			                            					   CollectionName: collectionName,
			                            					   nctids: [{
			                            						   nctid: keys.nctid,
			                            						   VersionDate: keys.VersionDate,
			                            						   InsertDate: new Date()
			                                                    }]	
			                                                });	
			                                        userCollection.save(function (err) {
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
			                                                 console.log('NCTID saved.');
			                                                 utils.writeResponse(req, res, resp);
			                                                 //callback(null, resp, null);
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
    app.post('/refreshCollection', RefreshCollection);
    app.post('/addToCollection', AddToCollection);

//	module.exports.RefreshCollection  = RefreshCollection ;
//	module.exports.AddToCollection   = AddToCollection ;
};

