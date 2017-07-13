var Board = require('./board.js');
var Validator = require('./boardValidator.js');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

function dbInit (db) {
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

function getShipPositions() {
  const shipsLeft = [5, 4, 3, 3, 2];
  let boardValidSpaces = Board.initBoard();
  let positions = [];
  for (let i = 0; i < 5; ++i) {
    const result = place(shipsLeft[i], boardValidSpaces);
    const newPosition = result.position;
    boardValidSpaces = result.updatedBoard;
    positions.push(newPosition);
  }
  //Validator.validateShipPositions(positions);
  return positions;
}

function place(shipSize, board) {
  let orientation = (Math.random() > 0.5) ? "H" : "V";
  let row, col;
  let placeFound = false;
  
  while (!placeFound) {
    col = Math.floor(Math.random() * (11 - shipSize));
    row = Math.floor(Math.random() * 10);
    if (orientation == "V") {
      [row, col] = [col, row];
    }
    placeFound = Board.testClear(row, col, orientation, shipSize, board);
  }
  const updatedBoard = Board.updateBoardValidSpaces(row, col, orientation, shipSize, board);
  const EndingSquare = (orientation == "H") 
                        ? { Row: Board.num2row(row), Column: col + shipSize } 
                        : { Row: Board.num2row(row + shipSize - 1), Column: col+1}

  return {  updatedBoard: updatedBoard,
            position: { StartingSquare: { Row: Board.num2row(row), Column: col+1 }, 
                        EndingSquare: EndingSquare } 
          };
}

function getNextTarget(position) {
  var column = getNextColumn(position.Column);
  var row = column === 1 ? getNextRow(position.Row) : position.Row;
  return { Row: row, Column: column }
}

function getNextRow(row) {
  var newRow = row.charCodeAt(0) + 1;
  if(newRow > 'J'.charCodeAt(0)) {
    return 'A';
  }
  return String.fromCharCode(newRow);
}

function getNextColumn(column) {
  return column % 10 + 1;
}

function randomFreeSpace (db) {
    const board = db.collection('board');
    const randomFreeSpace = board.aggregate([
        { $match: { Shot: false } },
        { $sample: { size : 1 } }
    ]).toArray();
    
    return randomFreeSpace;
}

function selectTarget(gamestate, db) {
    return randomFreeSpace(db);
}

module.exports = { 
  dbInit: dbInit,
  getShipPositions: getShipPositions,
  selectTarget: selectTarget
};