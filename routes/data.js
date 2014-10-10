module.exports = function(app, stock, constants, utils, log) {
    // 
    // data.js
    //
    var data = function(req, res) {
        var query = req.query;
        if (typeof query['ticker'] === 'undefined' || query['ticker'] === '') {
            utils.writeResponse(req, res, constants.E1000);
        } else {
            var limit = typeof query['limit'] != 'undefined' &&  utils.isNumber(query['limit']) ? query['limit']:100;
            var ticker = query['ticker'];
            stock.Stocks.find({
                t: ticker
            }, {}, {
                sort: {
                    lt_dts: -1
                }, limit:limit
            }, function(err, tickers) {
                if (typeof tickers === 'undefined' || tickers.length === 0) {
                    utils.writeResponse(req, res, constants.E1001);
                } else {
                    var message = {
                        http_status: constants.SUCCESS.status,
                        status: constants.SUCCESS.status,
                        data: tickers
                    };
                    utils.writeResponse(req, res, message);
                }
            });
        }
    };
    app.get('/data', data);
}
