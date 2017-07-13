var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MyBot = require('./src/MyBot.js');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
    if (!err) {
        console.log("Connected!");
    }
})

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/GetShipPositions', function(req, res) {
    var positions = MyBot.getShipPositions();
    res.send(positions);
});

app.post('/SelectTarget', function(req, res) {
    var target = MyBot.selectTarget(req.body);
    res.send(target);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
