var spawn = require('child_process').spawn;
var fs = require('fs');

if (process.argv.length < 5) {
    console.log('\nUsage: node system.js execFile environment mode[ debug | no-debug ]');
    console.log('Usage: node system.js ./app.sh development debug');
    console.log('Usage: node system.js ./app.sh staging debug');
    console.log('Usage: node system.js ./app.sh prodution no-debug\n');
    process.exit(1);
}
var execFileName = process.argv[2];
var environment = process.argv[3];
var debug = process.argv[4] === 'debug' ? true : false;

var consolelog = process.env.CONSOLE_LOG,
    appname = process.env.APP_NAME,
    appid = process.env.APP_ID;



//// Function definitions 


var checkEnvironment = function() {

    return (
        typeof consolelog === 'undefined' || consolelog === null ||
        typeof appname === 'undefined' || appname === null ||
        typeof appid === 'undefined' || appid === null
    );
}

var log = function(data) {

    if (debug) console.log(data);

}
var checkProcessRunning = function(appId, callback) {

    var pid = fs.readFileSync('.pid.' + appname);
    var p = pid.trim().split('\n');

    return p;

}
var killProcess = function(data) {

    for (var i = 0; i < data.length; i++) {
        process.kill(data[i].pid, 'SIGTERM');
        process.kill(data[i].ppid, 'SIGTERM');
    }
}
var startupProcess = function(execFileName) {

        var process = spawn('node', [execFileName]);

        if (typeof process.env.APP_NAME === 'undefined' || process.env.APP_NAME === null) {

            log('APPNAME not defined or null');
            return false;

        } else if (typeof process.env.LOG_FILE === 'undefined' || process.env.LOG_FILE === null) {

            log('LOGFILE not defined or null');
            return false;

        }

        fs.openSync(process.env.LOG_FILE, 'w+', '0644');

        fs.writeFileSync('.pid.' + process.env.APP_ID, process.pid);

        process.stdout.on('data', function(data) {

            fs.appendFileSync(process.env.LOG_FILE, '' + data);

        });

        fs.watch(process.env.LOG_FILE, function(event, fileName) {

            log(event);
            log(fileName);

        });

        process.stderr.on('data', function(data) {
            log('error ' + data);
        });

    }
    ////////////  ALL function defined  above


// Main execution 
// Start from here 
//

if (checkEnvironment()) {
    console.log('Environment variables missing ... ');
    console.log('Check APP_NAME, APP_ID and CONSOLE_LOG');
    process.exit(1);
}

var pids = checkProcessRunning();

log(pids);