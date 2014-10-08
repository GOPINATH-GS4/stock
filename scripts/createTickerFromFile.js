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

var data = fs.readFileSync(file,'utf8').split('\n'); 

_.each(data, function(record, index, records) {

  if (index === records.length -1) {
    stock.db.close();
  }
  else {
    var tickerArray = record.split('|');
    var ticker = {
        ticker: tickerArray[0]
        ,name: tickerArray[1]
        ,profile:[]
    };
    stock.Tickers(ticker).save(function(err, ticker) {
      if(err) 
        console.log('Error saving ticker ' + index + ' Error :' + err);
      else 
        console.log('Saved ' + util.inspect(ticker));
    });
  }
});
