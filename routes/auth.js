module.exports = function(app, stock, constants, utils, request, log) {
    // 
    // auth 
    //
    //  Author : Janakiraman Gopinath 

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

            request(utils.makePayload(utils.idsUrl + '/version/user/register', 'POST', body), function(error, response, body) {
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
                                var extra = {
                                    name: 'VALIDATELINK',
                                    content: process.env.APPURL + 'validate/'
                                };
                                sendEmail(req, res, b, extra, 'signin');
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
    var is_logged_in = function(req, res) {

        switch (req.method) {
            case 'POST':
                var body = {};
                var payLoad = utils.makePayload(utils.idsUrl + '/version/session', 'GET', body);
                payLoad.headers.userToken = req.body.userToken;

                request(payLoad, function(error, response, body) {
                    switch (response.statusCode) {
                        case 200:
                            var resp = (typeof body === 'string') ? JSON.parse(body) : body;

                            switch (resp.status) {
                                case 200:
                                    utils.writeResponse(req, res, resp);
                                    break;
                                default:
                                    utils.writeResponse(req, res, resp);
                                    break;
                            }
                            break;
                        default:
                            utils.writeResponse(req, res, resp);
                            break;
                    }
                });
                break;
            case 'GET':
                break;
            default:
                break;
        }
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
                    request(utils.makePayload(utils.idsUrl + '/version/user/validate', 'POST', req.body), function(error, response, body) {

                        switch (response.statusCode) {
                            case 200:
                                var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                switch (resp.status) {
                                    case 200:
                                        res.cookie('ctcToken', resp.accessToken, {
                                            maxAge: 60 * 1000 * 60 * 12
                                        });
                                        res.render('catalog', {
                                            username: resp.username,
                                            userId: resp.userId
                                        });
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


    var sendEmail = function(req, res, body, extra, page_to_render) {

        var mergevars = [{
            name: 'APPNAME',
            content: 'Clin analytics'
        }, extra];

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
                res.render(page_to_render, {
                    signup_error: err
                });
            } else
                res.render(page_to_render, {
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
                utils.encodeDecodeBase64(req.body.password, true, function(base64Passwd) {
                    req.body.password = base64Passwd;
                    request(utils.makePayload(utils.idsUrl + '/version/user/login', 'POST', req.body), function(error, response, body) {

                        switch (response.statusCode) {
                            case 200:
                                var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                switch (resp.status) {
                                    case 200:
                                        res.cookie('ctcToken', resp.accessToken, {
                                            maxAge: 60 * 1000 * 60 * 12
                                        });
                                        res.render('catalog', {
                                            username: resp.username,
                                            userId: resp.userId
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
    var signout = function(req, res) {

        switch (req.method) {
            case 'POST':
                break;
            case 'GET':
                utils.isLoggedIn(req, res, function(logIn) {
                    if (logIn.exists) {
                        var body = {};
                        var payLoad = utils.makePayload(utils.idsUrl + '/version/user/logout', 'POST', body);

                        payLoad.headers.userToken = logIn.ctcToken;

                        request(payLoad, function(error, response, body) {

                            switch (response.statusCode) {
                                case 200:
                                    var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                    switch (resp.status) {
                                        case 200:
                                            res.cookie('ctcToken', '', {
                                                maxAge: 0
                                            });
                                            res.render('signin', {
                                                username: resp.username
                                            });
                                            break;
                                        default:
                                            res.cookie('ctcToken', '', {
                                                maxAge: 0
                                            });
                                            res.render('signin', {
                                                login_error: resp.message
                                            });
                                            break;
                                    }
                                    break;

                                case 401:
                                    res.cookie('ctcToken', '', {
                                        maxAge: 0
                                    });
                                    res.render('signin', {
                                        login_error: 'Not authorized'
                                    });
                                    break;
                                default:
                                    res.cookie('ctcToken', '', {
                                        maxAge: 0
                                    });
                                    res.render('signin', {
                                        login_error: 'Something went wrong. Please contact support'
                                    });
                                    break;
                            }
                        });
                    } else {
                        res.cookie('ctcToken', '', {
                            maxAge: 0
                        });
                        res.render('signin', {
                            login_error: 'Not logged in'
                        });
                    }
                });
            default:
                break;
        }
    }
    var setNewPassword = function(req, res) {

        switch (req.method) {
            case 'POST':
                var passwd = req.body.password;
                var passwd_confirm = req.body.password_confirm;
                console.log('req.body : ' + JSON.stringify(req.body));
                if (passwd != passwd_confirm) {
                    res.render('setNewPassword', {
                        signup_error: 'both passwords don\'t match'
                    });
                    return;
                }

                var body = {};
                body.accountToken = req.body.accountToken;
                utils.encodeDecodeBase64(req.body.password, true, function(base64Passwd) {
                    body.password = base64Passwd;
                    request(utils.makePayload(utils.idsUrl + '/version/user/set_new_password', 'POST', body), function(error, response, body) {

                        switch (response.statusCode) {
                            case 200:
                                var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                                switch (resp.status) {
                                    case 200:
                                        res.render('setNewPassword', {
                                            signup_success: resp.message
                                        });
                                        break;
                                    default:
                                        res.render('setNewPassword', {
                                            signup_error: resp.message
                                        });
                                        break;
                                }
                                break;

                            case 401:
                                res.render('setNewPassword', {
                                    signup_error: 'Not authorized'
                                });
                                break;
                            default:
                                res.render('setNewPassword', {
                                    signup_error: 'Something went wrong. Please contact support'
                                });
                                break;
                        }
                    });
                });
                break;
            case 'GET':
                res.cookie('ctcToken', '', {
                    maxAge: 0
                });
                var userToken = req.path.split('/').pop();
                res.render('setNewPassword', {
                    clientToken: userToken
                });
                break;
            default:
                break;
        }
    }
    var reset = function(req, res) {

        switch (req.method) {
            case 'POST':
                var body = {};
                body.email = req.body.email;
                var email = body.email;
                request(utils.makePayload(utils.idsUrl + '/version/user/reset', 'POST', body), function(error, response, body) {

                    switch (response.statusCode) {
                        case 200:
                            var resp = (typeof body === 'string') ? JSON.parse(body) : body;
                            switch (resp.status) {
                                case 200:
                                    var b = {
                                        identifier: 'email',
                                        id: email,
                                        template: "ctc_reset_password"
                                    };
                                    var extra = {
                                        name: 'RESETLINK',
                                        content: process.env.APPURL + 'set_new_password/'
                                    };
                                    sendEmail(req, res, b, extra, 'resetPassword');
                                    break;
                                default:
                                    res.render('resetPassword', {
                                        signup_error: resp.message
                                    });
                                    break;
                            }
                            break;

                        case 401:
                            res.render('resetPassword', {
                                signup_error: 'Not authorized'
                            });
                            break;
                        default:
                            res.render('resetPassword', {
                                signup_error: 'Something went wrong. Please contact support'
                            });
                            break;
                    }
                });
                break;
            case 'GET':
                res.cookie('ctcToken', '', {
                    maxAge: 0
                });
                res.render('resetPassword');
                break;
            default:
                break;
        }
    }

    app.post('/signup', signup);
    app.get('/signup', signin);

    app.post('/signin', signin);
    app.get('/signin', signin);

    app.get('/signout', signout);

    app.get('/reset', reset);
    app.post('/reset', reset);

    app.get('/set_new_password/:user_token', setNewPassword);
    app.post('/set_new_password', setNewPassword);

    app.get('/validate/:user_token', validate_account);
    app.post('/validate', validate_account);

    app.post('/is_logged_in', is_logged_in);
    app.get('/is_logged_in', is_logged_in);
}