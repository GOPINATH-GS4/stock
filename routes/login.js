module.exports = function(app, stock, constants, utils, log) {
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
                    res.render('home');
                    break;

                case 1000:
                    res.render('index', {error : response.message});
                    break;

                default:
                    res.render('index', {error: 'Unexpected error'});
                    break;
            }
        });
    };
    app.post('/login', login);
}
