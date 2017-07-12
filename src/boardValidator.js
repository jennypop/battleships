var Board = require('./board.js');

function BoardValidator() {}

function validateShipPositions(positions) {
    if (positions.length != 5) {
        throw new Error("Wrong # of ships placed");
    }
    let shipsLeft = [2, 3, 3, 4, 5];
    for (let index = 0; index < positions.length; ++index) {
        let position = positions[index];
        const startCol = position.StartingSquare.Column;
        const startRow = Board.row2num(position.StartingSquare.Row);
        const endCol = position.EndingSquare.Column;
        const endRow = Board.row2num(position.EndingSquare.Row);
        const orientation = testHorizontalVertical(position);

        if ([startRow, startCol, endRow, endCol].some(
            (num) => {return num < 1 || num > 10;}
        )) {
            console.log(position);
            throw new Error(`Ship placed out of bounds: StartRow ${startRow}, endrow: ${endRow}, startCol ${startCol}, endCol: ${endCol}`);
        }
        updateShipsLeft(shipsLeft, orientation, startRow, endRow, startCol, endCol);
    }
    if (shipsLeft.length > 0) {
        throw new Error("Ships left over to place : " + shipsLeft.toString())
    }
    Board.getBoard(positions);
}

function updateShipsLeft (shipSizes, orientation, startRow, endRow, startCol, endCol) {
    let shipSize;
    if (orientation == "H") {
        shipSize = Math.abs(endCol - startCol)+1;
    } else {
        shipSize = Math.abs(endRow - startRow)+1;
    }
    const shipSizeIndex = shipSizes.indexOf(shipSize);
    if (shipSizeIndex > -1) {
        shipSizes.splice(shipSizeIndex, 1);
    } else {
        throw new Error("Tried to add an unavailable ship size");
    }
}

function testHorizontalVertical (position) {
    if (position.StartingSquare.Column == position.EndingSquare.Column) {
        return "V";
    } else if (position.StartingSquare.Row == position.EndingSquare.Row) {
        return "H";
    } else {
        throw new Error("Ships not placed horizontally/vertically");
    }
}

BoardValidator.validateShipPositions = validateShipPositions;
module.exports = BoardValidator;