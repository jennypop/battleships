var MongoClient = require('mongodb').MongoClient;
var Board = require('./board.js');
var assert = require('assert');

var dbInit = function (db) {
    const board = db.collection('board');

    let spaces = [];
    for (let i = 0; i < 10; ++i) {
        for (let j = 1; j <= 10; ++j) {
            spaces.push( { Row: Board.num2row(i), Column: j , Shot: false, enemyShip: false } );
        }
    }
    board.remove({}, function(err, removed){
        board.insertMany(spaces, {w: 1}, function (err, result) {
                assert.equal(null, err);
                assert.equal(100, result.insertedCount);
        })
    })
    
}

var randomFreeSpace = function(db) {
    const board = db.collection('board');
    const randomFreeSpace = board.aggregate([
        { $match: { Shot: false } },
        { $sample: { size : 1 } }
    ]).toArray();
    
    return randomFreeSpace;
}

module.exports = {dbInit, randomFreeSpace};
/*
    initBoard
    updateBoard
    board

    spacesToTry

    shipSizes
*/
