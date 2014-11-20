module.exports = function(app, constants, utils, log) {
    // 
    // File: login.js
    // Author: Janakiraman Gopinath 
    //
    var validate = function(data, callback) {
        var response = {};

        if (typeof data.username === 'undefined' || data.username === '') {
            response['status'] = 1000;
            response['message'] = 'username is required';
        } else if (typeof data.password === 'undefined' || data.password === '') {
            response['status'] = 1000;
            response['message'] = 'password is required';
        } else {
            // TODO add logic to authenticate the user
            response['status'] = 200;
            response['message'] = 'Success';
        }
        callback(response);
    };

    var login = function(req, res) {

        validate(req.body, function(response) {

            console.log(utils.util.inspect(response));
            switch (response.status) {

                case 200:
                    var resp = {
                        status: 200,
                        data: {
                            results: []
                        }
                    };
                    res.render('home', {
                        resp: resp
                    });
                    break;

                case 1000:
                    res.render('login', {
                        error: response.message
                    });
                    break;

                default:
                    res.render('login', {
                        error: 'Unexpected error'
                    });
                    break;
            }
        });
    };
    app.post('/login', login);
    app.get('/login', login);
}
