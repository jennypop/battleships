var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var MyBot = require('./src/MyBot.js');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

const localDB = "mongodb://localhost:27017/exampleDb";
const herokuDB = "mongodb://heroku_c5pkfdd9:engufdrjjiuekeig6u7igvaroq@ds157712.mlab.com:57712/heroku_c5pkfdd9";
MongoClient.connect(herokuDB, function (err, db) {
    if (err) { return console.dir(err); }
    console.log("Connected to server!");
    
    app.get('/GetShipPositions', function(req, res) {
        MyBot.dbInit(db);
        var positions = MyBot.getShipPositions();
        res.send(positions);
    });

    app.post('/SelectTarget', function(req, res) {
        var targetPromise = MyBot.selectTarget(req.body, db);
        targetPromise.then((targetlist) => 
            {   if (targetlist.length == 0) {
                    console.log("ran out of targets!!");
                }
                target = targetlist[0];
                res.send({ Row: target.Row, Column: target.Column}); }
        );
    });
});