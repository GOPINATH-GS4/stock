(function() {
    /**
     * Module dependencies.
     */
    var express = require('express'),
        https = require('https'),
        path = require('path'),
        fs = require('fs'),
        log = require('winston'),
        session = require('redis'),
        UTILS = require('./lib/utils.js').utils,
        CTCMODEL = require('./models/ctcModel.js').ctcModel,
        constants = require('./lib/constants.js')

    // Initialize log and add a transport file 
    log.add(log.transports.File, {
        filename: process.env.logfile
    });

    var app = express();
    var utils = new UTILS(log);
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
    var login = require('./routes/login.js')(app, constants, utils, log);
    var search = require('./routes/search.js')(app, ctcModel, constants, utils, log);
    var collections = require('./routes/collections.js')(app, constants, utils, log);
    var drone = require('./routes/drone.js')(app, constants, utils, log);

    https.createServer(options, app).listen(app.get('port'), function() {
        log.info('Express server listening on port ' + app.get('port'));
    });
}).call(this);