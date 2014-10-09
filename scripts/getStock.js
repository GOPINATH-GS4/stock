var request = require('request');
var _ = require('underscore');
var stockModel = require('../models/stockModel.js').stockModel;
var util = require('util');

var stock = new stockModel();

var getStock = function(ticker, exchange) {
  request.get(
   'http://finance.google.com/finance/info?client=ig&q=' + exchange + ':'+ ticker, {}, function (error, response, body) {
    if(body != null && body != '') {
      var resp = JSON.parse(body.replace(/\n/g,'').replace(/\//g,''));
      resp.forEach(function(x,index) {
        console.log(util.inspect(x));
        stock.Stocks(x).save(function(err, s) {
          if(err) console.log('Error saving stock ' + err);
          else console.log(s);
        });
      });
    }
  });
};

setInterval(function() {
  stock.Tickers.find({}, function(err, ticker) {
    ticker.forEach(function(ticker, index, tickers) {
      getStock(ticker.ticker, ticker.exchange);
    });
  });
}, process.env.TIMER || 900000); // 15 min default 
