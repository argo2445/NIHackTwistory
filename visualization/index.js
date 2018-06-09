"use strict";
var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(serveStatic(path.join(__dirname, 'static')));

app.post("/getData", function(req, res){
    console.log("Hallo", req.body.emotion);
    if(req.body.emotion === "anger"){
        res.send({
            tweets: [
                {
                    name: "Massachusetts",
                    anger: 0.8
                },
                {
                    name: "Massachusetts",
                    anger: 0.5
                },
                {
                    name: "Massachusetts",
                    anger: 0.7
                }
            ]
        });
    }
    else if(req.body.emotion === "disgust"){
        res.send({
            tweets: [
                {
                    name: "Utah",
                    anger: 0.8
                },
                {
                    name: "Massachusetts",
                    anger: 0.3
                },
                {
                    name: "Kentucky",
                    anger: 0.7
                }
            ]
        });
    }
    else{
        res.send({tweets: []});
    }
});

app.listen(8080);
