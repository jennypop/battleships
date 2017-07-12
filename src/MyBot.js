var Board = require('./board.js');
var Validator = require('./boardValidator.js');

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

console.log(getShipPositions());

function place(shipSize, board) {
  //let orientation = (Math.random() > 0.5) ? "H" : "V";
  let orientation = "H"; let row, col;
  let placeFound = false;
  if (orientation == "H") {
    while (!placeFound) {
      col = Math.floor(Math.random() * (11 - shipSize));
      row = Math.floor(Math.random() * 10);
      placeFound = Board.testClear(row, col, orientation, shipSize, board);
    }
    const updatedBoard = Board.updateBoardValidSpaces(row, col, orientation, shipSize, board);
    return {  updatedBoard: updatedBoard,
              position: { StartingSquare: { Row: Board.num2row(row), Column: col }, 
                          EndingSquare: { Row: Board.num2row(row), Column: col + shipSize-1 }} 
            };
  // } else {
  //   while (!placeFound) {
  //     let row = Math.floor(Math.random() * (11 - shipSize));
  //     let col = Math.floor(Math.random() * 10);
  //     placeFound = Board.testClear(row, col, orientation, shipSize, board);
  //   }
  //   return { StartingSquare: { Row: Board.num2row(row), Column: col }, 
  //            EndingSquare: { Row: Board.num2row(row + shipSize), Column: col } };
  }
  
    
}

/*
  
  
  return [
      { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
      { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
      { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
      { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
      { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
    ]
  

*/

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

function selectTarget(gamestate) {
  var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
  if(previousShot) {
    return getNextTarget(previousShot.Position);
  }
  return { Row: "A", Column: 1 };  
}

module.exports = { 
  getShipPositions: getShipPositions,
  selectTarget: selectTarget
};