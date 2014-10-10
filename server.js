(function() {
    /**
     * Module dependencies.
     */
    var express = require('express'),
        https = require('https'),
        path = require('path'),
        fs = require('fs'),
        log = require('winston'),
        stockModel = require('./models/stockModel.js').stockModel,
        session = require('redis'),
        UTILS = require('./lib/utils.js').utils,
        constants = require('./lib/constants.js')

    // Initialize log and add a transport file 
    log.add(log.transports.File, {
        filename: process.env.logfile
    });

    var app = express();
    var stock = new stockModel();
    var utils = new UTILS(log);

    // Set this in all environments

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {
        layout: false
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

    var index = require('./routes/index.js')(app, stock, constants, utils, log);
    var tiker = require('./routes/ticker.js')(app, stock, constants, utils, log);
    var data = require('./routes/data.js')(app, stock, constants, utils, log);

    https.createServer(options, app).listen(app.get('port'), function() {
        log.info('Express server listening on port ' + app.get('port'));
    });
}).call(this);
