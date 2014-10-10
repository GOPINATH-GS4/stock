module.exports = function(app, stock, constants, utils, log) {
    // 
    // index.js
    //
    var ticker = function(req, res) {
        stock.Tickers.find({}, function(err, tickers) {
            if (err)
                var message = {
                    http_status: constants.SUCCESS.status,
                    status: constants.FAILURE.status,
                    message: err
                };
            else
                var message = {
                    http_status: constants.SUCCESS.status,
                    status: constants.SUCCESS.status,
                    message: tickers
                };
            utils.writeResponse(req, res, message);
        });
    };
    app.get('/ticker', ticker);
}