"use strict";
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mysql = require('mysql');
var app = express();

app.use(serveStatic(path.join(__dirname, 'static')));

//app.post

app.listen(8080);
