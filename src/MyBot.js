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

function selectTarget(gamestate) {
  var previousShot = gamestate.MyShots && gamestate.MyShots[gamestate.MyShots.length-1];
  let row = Board.num2row(Math.floor(Math.random() * 10));
  let col = Math.floor(Math.random() * 10) + 1;
  if(previousShot && previousShot.WasHit) {
     col = Math.min(previousShot.Position.Column + 1, 10);
  }
  return { Row: row, Column: col };  
}

module.exports = { 
  getShipPositions: getShipPositions,
  selectTarget: selectTarget
};