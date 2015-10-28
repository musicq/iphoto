var express = require('express');
var fs = require("fs");

var app = express();

var jsonData = null;
fs.readFile('./demo/data.json', function (err, data) {
  if (err) {
    return console.error(err);
  }
  jsonData = JSON.parse(data);
});


app.use('/', express.static(__dirname + '/demo'));
app.use('/public', express.static(__dirname + '/dist'));


app.get('/api/iphotos', function(req, res) {
  res.jsonp(jsonData);
});

app.listen(3000, function() {
  console.log('App is on http://localhost:3000/');
})