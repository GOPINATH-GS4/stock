module.exports = function(app, stock, constants, utils, request, log) {
    // 
    // auth 
    //
    //  Author : Janakiraman Gopinath 

    var idsUrl = process.env.IDSURL;
    var signup = function(req, res) {

        var body = {};
        body.firstName = req.body.firstname;
        body.lastName = req.body.lastname;
        body.email = req.body.email;
        body.username = req.body.username;
        body.acceptTerms = req.body.acceptTerms;
        body.orgId = process.env.ORGID;

        utils.encodeDecodeBase64(req.body.password, true, function(base64Passwd) {
            body.password = base64Passwd;

            request(makePayload(idsUrl + '/version/user/register', body), function(error, response, body) {
                switch (response.statusCode) {
                    case 200:
                        var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                        switch (resp.status) {
                            case 200:
                                var b = {
                                    identifier: 'userId',
                                    id: resp.userId,
                                    template: "ctc_validate",
                                };
                                sendEmail(req, res, b);
                                break;
                            default:
                                res.render('signin', {
                                    signup_error: resp.message
                                });
                                break;
                        }
                        break;

                    case 401:
                        res.render('signin', {
                            signup_error: 'Not authorized'
                        });
                        break;
                    default:
                        res.render('signin', {
                            signup_error: 'Something went wrong. Please contact support'
                        });
                        break;
                }
            });

        });
    }
    var validate_account = function(req, res) {

        switch (req.method) {
            case 'GET':
                var body = {};
                var userToken = req.path.split('/').pop();
                res.render('validate', {
                    clientToken: userToken
                });
                break;
            case 'POST':
                utils.encodeDecodeBase64(req.body.password, true, function(base64Passwd) {
                    req.body.password = base64Passwd;
                    request(makePayload(idsUrl + '/version/user/validate', req.body), function(error, response, body) {

                        switch (response.statusCode) {
                            case 200:
                                var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                switch (resp.status) {
                                    case 200:
                                        res.render('catalog');
                                        break;
                                    default:
                                        res.render('validate', {
                                            validate_error: resp.message
                                        });
                                        break;
                                }
                                break;

                            case 401:
                                res.render('signin', {
                                    validate_error: 'Not authorized'
                                });
                                break;
                            default:
                                res.render('signin', {
                                    validate_error: 'Something went wrong. Please contact support'
                                });
                                break;
                        }
                    });
                });
                break;
        }

    }

    var makePayload = function(url, body) {
        var payload = {
            url: url,
            headers: {
                'User-Agent': 'request',
                'ClientToken': process.env.CLIENTTOKEN
            },
            jar: false,
            method: 'POST',
            form: body,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };
        return payload;
    }

    var sendEmail = function(req, res, body) {

        var mergevars = [{
            name: 'APPNAME',
            content: 'Clin analytics'
        }, {
            name: 'VALIDATELINK',
            content: process.env.APPURL + 'validate/'
        }];

        body.mergevars = mergevars;

        var payload = {
            url: process.env.IDSURL + '/version/user/email',
            headers: {
                'User-Agent': 'request',
                'ClientToken': process.env.CLIENTTOKEN
            },
            jar: false,
            method: 'POST',
            form: body,
            rejectUnauthorized: false,
            requestCert: true,
            agent: false
        };
        request(payload, function(err, response, body) {
            if (err) {
                res.render('signin', {
                    signup_error: err
                });
            } else
                res.render('signin', {
                    signup_success: 'Success - Please see your email'
                });
        });

    };
    var signin = function(req, res) {

        switch (req.method) {
            case 'GET':
                res.render('signin');
                break;
            case 'POST':
                console.log(req.body);
                utils.encodeDecodeBase64(req.body.password, true, function(base64Passwd) {
                    req.body.password = base64Passwd;
                    request(makePayload(idsUrl + '/version/user/login', req.body), function(error, response, body) {

                        switch (response.statusCode) {
                            case 200:
                                var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                switch (resp.status) {
                                    case 200:
                                        res.render('catalog', {
                                            username: resp.username
                                        });
                                        break;
                                    default:
                                        res.render('signin', {
                                            login_error: resp.message
                                        });
                                        break;
                                }
                                break;

                            case 401:
                                res.render('signin', {
                                    login_error: 'Not authorized'
                                });
                                break;
                            default:
                                res.render('signin', {
                                    login_error: 'Something went wrong. Please contact support'
                                });
                                break;
                        }
                    });
                });
                break;
        }
    }
    app.post('/signup', signup);
    app.get('/signup', signin);
    app.post('/signin', signin);
    app.get('/signin', signin);
    app.get('/validate/:user_token', validate_account);
    app.post('/validate', validate_account);
}