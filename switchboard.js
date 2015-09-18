require("babel/register");
var express = require('express');
var app = express();

var config = require('./config.js');
var manager = require('./manager.js');

app.get('/', function(req, res) {
  res.send('' + new manager(req.query).print());
});

app.listen(8080);
