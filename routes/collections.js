module.exports = function(app, constants, utils, log) {
    // 
    // collections.js
    // Author: Janakiraman Gopinath 
    //
    var collections = function(req, res) {
        console.log('Body : ' + utils.util.inspect(req.body));
        // fetch all the collections for the user and display card
        res.render('collections', {
            data: [{
                'nctid': 12345
            }, {
                'description': 'Cancer'
            }, {
                'trt_groups': [{
                    'trt1': 'treatment1'
                }, {
                    'trt2': 'treatment2'
                }, {
                    'placebo': 'placebo'
                }]
            }, {
                'trt_assignment': [{
                    'trt1': 20
                }, {
                    'trt2': 30
                }, {
                    'placebo': 10
                }]
            }]
        });


    };
    app.get('/collections', collections);
}