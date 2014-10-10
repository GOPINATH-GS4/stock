var fs = require('fs');
var _ = require('underscore');
var stockModel = require('../models/stockModel.js').stockModel;
var util = require('util');

var stock = new stockModel();

if (process.argv.length < 3) {
    console.log('\nUsage data-file');
    process.exit(1);
}

var file = process.argv[2];

var data = _.compact(fs.readFileSync(file, 'utf8').split('\n'));

console.log(util.inspect(data));
stock.Tickers.remove({}, function(err) {

    if (err) console.log(err);

    var totalCount = data.length;
    var count = 0;
    data.forEach(function(record, index, records) {

        var tickerArray = record.split('|');

        var ticker = {
            ticker: tickerArray[0],
            name: tickerArray[1],
            exchange: tickerArray[2],
            profile: []
        };
        stock.Tickers(ticker).save(function(err, t) {
            if (err) console.log(err);
            else console.log('Saved ' + util.inspect(t));
            count++;

            if (count === totalCount) stock.db.close();
        });
    });
});