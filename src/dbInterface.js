var MongoClient = require('mongodb').MongoClient;

var main = function () {
    MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
        if (!err) {
            console.log("Connected!");
        }
    })
}


module.exports = main;