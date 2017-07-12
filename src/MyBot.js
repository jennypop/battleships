/*
  10 Rows from A to J
  10 columns from 1 to 10
*/ 

function getShipPositions() {
  return [
      { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
      { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
      { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
      { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
      { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
    ]
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
  if(previousShot) {
    return getNextTarget(previousShot.Position);
  }
  return { Row: "A", Column: 1 };  
}

module.exports = { 
  getShipPositions: getShipPositions,
  selectTarget: selectTarget
};