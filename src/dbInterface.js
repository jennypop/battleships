var MongoClient = require('mongodb').MongoClient;
var Board = require('./board.js');
var assert = require('assert');

// mongodb://heroku_c5pkfdd9:engufdrjjiuekeig6u7igvaroq@ds157712.mlab.com:57712/heroku_c5pkfdd9
MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, db) {
    if (err) { return console.dir(err); }
    console.log("Connected to server!");
    const board = db.collection('board');

    let spaces = [];
    for (let i = 0; i < 10; ++i) {
        for (let j = 1; j <= 10; ++j) {
            spaces.push( { Row: Board.num2row(i), Column: j+1 , Shot: false, enemyShip: false } );
        }
    }
    board.insertMany(spaces, {w: 1}, function (err, result) {
        assert.equal(null, err);
        assert.equal(100, result.insertedCount);
    })

    const randomFreeSpace = board.aggregate([
        { $match: { Shot: false } },
        { $sample: { size : 1 } }
    ]).toArray();
    
    randomFreeSpace.then(function (result) { console.log(result); } )

    db.close();
});



/*
    initBoard
    updateBoard
    board

    spacesToTry

    shipSizes
*/
