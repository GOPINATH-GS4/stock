(function() {
    /**
     * Module dependencies.
     */
    var express = require('express'),
        https = require('https'),
        path = require('path'),
        fs = require('fs'),
        log = require('winston'),
        request = require('request'),
        session = require('redis'),
        UTILS = require('./lib/utils.js').utils,
        CTCMODEL = require('./models/ctcModel.js').ctcModel,
        cookieParser = require('cookie-parser'),
        constants = require('./lib/constants.js')


    // Initialize log and add a transport file 
    log.add(log.transports.File, {
        filename: process.env.logfile
    });

    var app = express();
    var utils = new UTILS(request, log);
    var ctcModel = new CTCMODEL();

    // Set this in all environments
    //

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {
        layout: true
    });
    app.use(express.static(__dirname + '/public'));
    app.set('port', process.env.PORT || 9801);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser())

    // development only
    if ('development' === process.env.environment) {

        app.use(express.errorHandler());
        var privateKey = fs.readFileSync(__dirname + '/stock-key.pem');
        var certificate = fs.readFileSync(__dirname + '/stock-cert.pem');
        var options = {
            key: privateKey,
            cert: certificate
        };

    } else { // Remove console logging from other environments 

        log.add(log.transports.File, {
            filename: process.env.logfile
        });
        log.remove(log.transports.Console);

    }

    var index = require('./routes/index.js')(app, constants, utils, log);
    var search = require('./routes/search.js')(app, ctcModel, constants, utils, log);
    var collections = require('./routes/collections.js')(app, ctcModel, constants, utils, log);
    var catalog = require('./routes/catalog.js')(app, ctcModel, constants, utils, log);
    var auth = require('./routes/auth.js')(app, ctcModel, constants, utils, request, log);
    var save = require('./routes/save.js')(app, ctcModel, constants, utils, request, log);
    https.createServer(options, app).listen(app.get('port'), function() {
        log.info('Express server listening on port ' + app.get('port'));
    });
}).call(this);