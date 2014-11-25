module.exports = function(app, ctcModel, constants, utils, log) {
    // 
    // search.js
    // Author: Janakiraman Gopinath 
    //
    var request = require('request');
    var search = function(req, res) {

        switch (req.method) {
            case 'POST':
                console.log('Body : ' + utils.util.inspect(req.body));
                // 1. make a call to lilly coi 
                // 2. 
                console.log('Body : ' +
                    'http://api.lillycoi.com/v1/trials/search.json?query=' + req.body.searchText);
                var resp = {
                    status: 200,
                    data: {
                        results: []
                    }
                };
                request.get(
                    'http://api.lillycoi.com/v1/trials/search.json?query=' + req.body.searchText, {},
                    function(error, response, body) {
                        if (error) {
                            var resp = {
                                status: 500,
                                message: error
                            };
                            utils.writeResponse(req, res, response);
                        } else {
                            var data = JSON.parse(body);
                            processResults(data, req.body.sessionToken, req.body.searchText, req, res);
                        }
                    });
                break;
            case 'GET':
                console.log('Body : ' + utils.util.inspect(req.body));
                console.log('Path : ' + utils.util.inspect(req.url));
                console.log('Query : ' + utils.util.inspect(req.query));
                var sessionToken = req.url.split('/').pop();

                console.log('Session Token : ' + sessionToken);

                ctcModel.Searchs.find(sessionToken === 'search' ? {} : {
                    session_token: sessionToken
                }, function(err, searchs) {
                    var resp = [];

                    utils._.each(searchs, function(search) {
                        console.log('search : ' + utils.util.inspect(search));
                        utils._.each(search.ctcs, function(ctc) {
                            var response = {};
                            response.nct_id = ctc.nct_id;
                            response.condition = ctc.conditions;
                            response.overall_status = ctc.overall_status;
                            response.summary = ctc.summary;
                            response.primary_outcomes = ctc.primary_outcomes;
                            response.secondary_outcomes = ctc.secondary_outcomes;
                            resp.push(response);
                        });
                    });
                    utils.writeResponse(req, res, resp);
                });
        }
    };
    var processResults = function(data, sessionToken, searchText, req, res) {

        var results = data.results;
        var search = {
            search_text: searchText,
            session_token: sessionToken,
            ctcs: []
        };

        var conditions = [];
        var outcomes = [];

        for (var i = 0; i < results.length; i++) {
            var ctc = {};
            ctc.nct_id = results[i].id;
            ctc.summary = results[i].brief_summary.textblock;
            ctc.overall_status = results[i].overall_status;
            ctc.type = results[i].study_type;
            ctc.conditions = results[i].condition;
            ctc.primary_outcomes = results[i].primary_outcome;
            ctc.secondary_outcomes = results[i].secondary_outcome;
            search.ctcs.push(ctc);
        }

        ctcModel.Searchs(search).save(function(err, search) {
            var resp = {
                status: 200,
                message: 'Success'
            };
            utils.writeResponse(req, res, resp);
        });
    }
    app.post('/search', search);
    app.get('/search/*', search);
    app.get('/search', search);
}