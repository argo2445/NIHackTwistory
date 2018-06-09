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

var code_states = {
    'AK': 'Alaska',
    'AL': 'Alabama',
    'AR': 'Arkansas',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DC': 'District of Columbia',
    'DE': 'Delaware',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'IA': 'Iowa',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'MA': 'Massachusetts',
    'MD': 'Maryland',
    'ME': 'Maine',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MO': 'Missouri',
    'MP': 'Northern Mariana Islands',
    'MS': 'Mississippi',
    'MT': 'Montana',
    'NA': 'National',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'NE': 'Nebraska',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NV': 'Nevada',
    'NY': 'New York',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VA': 'Virginia',
    'VI': 'Virgin Islands',
    'VT': 'Vermont',
    'WA': 'Washington',
    'WI': 'Wisconsin',
    'WV': 'West Virginia',
    'WY': 'Wyoming'
};

function toNice(state){
    if(/.*, USA$/.test(state)){
        return state.replace(/(.*), USA/, "$1");
    }
    else if(/.*, ([ACDFGHIKLMNOPSTUVW][ACDEHIKLMNOPRSTUVXYZ])$/.test(state))
        return code_states[state.replace(/.*, ([ACDFGHIKLMNOPSTUVW][ACDEHIKLMNOPRSTUVXYZ])/, "$1")];
}

var config = {
    host: '10.42.0.111',
    port: 3306,
    user: 'root',
    password: 'geheim',
    database: 'twistory',
    connectionLimit: 15,
    queueLimit: 30,
    acquireTimeout: 2147483647
}

var poolCluster = mysql.createPool(config);

app.post("/getData", function(req, res){
    console.log("Hallo", req.body.emotion, req.body.ht);
    var prom = new Promise(function(resolve, reject) {
        try {
            poolCluster.getConnection(function(err, conn) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                conn.query(
                    mysql.format(
                        "SELECT U.location,T."+req.body.emotion+" FROM tweets AS T JOIN users AS U ON T.user_id=U.user_id JOIN tweet_tags AS H ON H.tweet_id=T.tweet_id WHERE T.watson_processed=1 AND U.location REGEXP '.*, USA$|.*, [ACDFGHIKLMNOPSTUVW][ACDEHIKLMNOPRSTUVXYZ]$' AND LOWER(H.tag)=LOWER(?);", 
                        [req.body.ht]), 
                    function(err2, result2, fields2) {
                        if (err2) {
                            console.log(err2);
                            reject(err2);
                            return;
                        }

                        console.log("Got data");
                        resolve(result2);
                        return;
                });
            });
        } catch (err) {
            console.log("Caught error: "+err);
            reject(err);
        }
    }).then(function(result) {
        var ans = {
            tweets: []
        };

        result.forEach(function(d){
            ans.tweets.push({
                name: toNice(d.location),
                [req.body.emotion]: d[req.body.emotion]
            })
        });

        res.send(ans); //send result to client
    }, function(err) {
        console.log(err);
        res.send({
            "tweets": []
        });
    });
    /*if(req.body.emotion === "anger"){
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
    }*/
});

app.listen(8080);
