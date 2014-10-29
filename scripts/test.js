var util = require('util');
var x = new Array;
var y = new Array;

var populate = function(callback) {
  for (var i = 0; i < 100; i++) { 
    x.push({'val':i});
  }
  for (var i = 0; i < 1000; i++)  {
    y.push({'val':i});
  }
  callback();

}

populate(function() {

  x.forEach(function(x1) {
    console.log('X = ' + x1);
  });

  y.forEach(function(y1) {
    console.log('Y = ' + y1);
  });
});
