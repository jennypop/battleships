function BoardValidator() {}

function row2num(letter) { return letter.charCodeAt(0) - "A".charCodeAt(0) + 1; }

function checkSquare(value, row, col, board) {
    if (board[row][col] != 0) {
        throw new Error(`Overlapping boats at row ${row}, col ${col}!`);
    }
    const adjacentSquares = [
        board[row-1][col-1], board[row-1][col], board[row-1][col+1], 
        board[row][col-1],                      board[row][col+1], 
        board[row+1][col-1], board[row+1][col], board[row+1][col+1] 
    ];
    if (adjacentSquares.some(
            (num) => { return typeof num != 'undefined' && num != 0 && num != value;}
        )) {
        throw new Error(`Adjacent boat placement at row ${row}, col ${col}`);
    }
}

function getBoard(positions) {
    let board = [];
    for (let i = 0; i < 10; ++i) {
        let row = [];
        for (let i = 0; i < 10; ++i) {
            row.push(0);
        }
        board.push(row);
    }
    for (let k = 1; k <= positions.length; ++k) {
        const startRow = row2num(positions[k].StartingSquare.Row)-1;
        const endRow = row2num(positions[k].EndingSquare.Row)-1;
        const startCol = positions[k].StartingSquare.Column-1;
        const endCol = positions[k].EndingSquare.Column-1;
        if (startCol == endCol) {
            if (endRow > startRow) {
                inc = 1;
            } else {
                inc = -1;
            }
            for (let j = startRow; j <= endRow; j += inc) {
                checkSquare(k, j, startCol, board);
                board[j][startCol] = k;
            }
        } else {
            if (endCol > startCol) {
                inc = 1;
            } else {
                inc = -1;
            }
            for (let i = startCol; i <= endCol; i += inc) {
                checkSquare(k, startRow, i, board);
                board[startRow][i] = k;
            }
        }   
    }
    return board;
}

function validateShipPositions(positions) {
    if (positions.length != 5) {
        throw new Error("Wrong # of ships placed");
    }
    let shipsLeft = [2, 3, 3, 4, 5];
    for (let index = 0; j < positions.length; ++index) {
        const startCol = position.StartingSquare.Column;
        const startRow = row2num(position.StartingSquare.Row);
        const endCol = position.EndingSquare.Column;
        const endRow = row2num(position.EndingSquare.Row);
        const orientation = testHorizontalVertical(positions[index]);

        if ([startRow, startCol, endRow, endCol].some(
            (num) => {return num < 1 || num > 10;}
        )) {
            throw new Error("Ship placed out of bounds");
        }
        shipsLeft = updateShipsLeft(shipsLeft, orientation, startRow, endRow, startCol, endCol);
    }
    if (correctShipSizes.length > 0) {
        throw new Error("Ships left over to place : " + correctShipSizes.toString())
    }
    getBoard();
}

function updateShipsLeft (shipSizes, orientation, startRow, endRow, startCol, endCol) {
    let shipSize;
    if (orientation.equals("H")) {
        shipSize = Math.abs(endCol - startCol)+1;
    } else {
        shipSize = Math.abs(endRow - startRow)+1;
    }
    const shipSizeIndex = ShipSizes.indexOf(shipSize);
    if (shipSizeIndex > -1) {
        return ShipSizes.splice(shipSizeIndex, 1);
    } else {
        throw new Error("Tried to add an unavailable ship size");
    }
}

function testHorizontalVertical (position) {
    if (position.StartingSquare.Column == position.EndingSquare.Column) {
        return "V";
    } else if (pos[j].StartingSquare.Row == pos[j].EndingSquare.Row) {
        return "H";
    } else {
        throw new Error("Ships not placed horizontally/vertically");
    }
}

BoardValidator.getBoard = getBoard;
BoardValidator.validateShipPositions = validateShipPositions;
module.exports = BoardValidator;