module.exports = function(app, stock, constants, utils, log) {
  // 
  // index.js
  //
  var index = function(req, res) {
    utils.writeResponse(req, res, constants.SUCCESS);
  };
  app.get('/', index);
}
