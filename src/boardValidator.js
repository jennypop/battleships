function BoardValidator() {}

function row2num(letter) { return letter.charCodeAt(0) - "A".charCodeAt(0) + 1; }

function checkSquare(value, row, col, board) {
    if (board[row][col] != 0) {
        throw new Error(`Overlapping boats at row ${row}, col ${col}!`);
    }
    const rowAbove = Math.max(row-1, 0);
    const colLeft = Math.max(col-1, 0);
    const rowBelow = Math.min(row+1, 9);
    const colRight = Math.min(col+1, 9);

    const adjacentSquares = [
        board[rowAbove][colLeft], board[rowAbove][col], board[rowAbove][colRight], 
        board[row][colLeft],                            board[row][colRight], 
        board[rowBelow][colLeft], board[rowBelow][col], board[rowBelow][colRight] 
    ];
    if (adjacentSquares.some(
            (num) => { return typeof num != 'undefined' && num != 0 && num != value;}
        )) {
        throw new Error(`Adjacent boat placement at row ${row+1}, col ${col+1}`);
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
    for (let k = 0; k < positions.length; ++k) {
        let startRow = row2num(positions[k].StartingSquare.Row)-1;
        let endRow = row2num(positions[k].EndingSquare.Row)-1;
        let startCol = positions[k].StartingSquare.Column-1;
        let endCol = positions[k].EndingSquare.Column-1;
        const shipNum = k+1;
        if (startCol == endCol) {
            if (endRow <= startRow) {
                [endRow, startRow] = [startRow, endRow];
            }
            for (let j = startRow; j <= endRow; ++j) {
                checkSquare(shipNum, j, startCol, board);
                board[j][startCol] = shipNum;
            }
        } else {
            if (endCol <= startCol) {
                [endCol, startCol] = [startCol, endCol];
            }
            for (let i = startCol; i <= endCol; ++i) {
                checkSquare(shipNum, startRow, i, board);
                board[startRow][i] = shipNum;
            }
        }   
    }
    return board;
}

function boardEquals(board1, board2) {
    for (i = 0; i < 10; ++i) {
        for (j = 0; j < 10; ++j) {
            if ((board1[i][j] == 0) != (board2[i][j] == 0)) {
                return false;
            }
        }
    }
    return true;
}

function validateShipPositions(positions) {
    if (positions.length != 5) {
        throw new Error("Wrong # of ships placed");
    }
    let shipsLeft = [2, 3, 3, 4, 5];
    for (let index = 0; index < positions.length; ++index) {
        let position = positions[index];
        const startCol = position.StartingSquare.Column;
        const startRow = row2num(position.StartingSquare.Row);
        const endCol = position.EndingSquare.Column;
        const endRow = row2num(position.EndingSquare.Row);
        const orientation = testHorizontalVertical(position);

        if ([startRow, startCol, endRow, endCol].some(
            (num) => {return num < 1 || num > 10;}
        )) {
            throw new Error("Ship placed out of bounds");
        }
        updateShipsLeft(shipsLeft, orientation, startRow, endRow, startCol, endCol);
    }
    if (shipsLeft.length > 0) {
        throw new Error("Ships left over to place : " + shipsLeft.toString())
    }
    getBoard(positions);
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

BoardValidator.getBoard = getBoard;
BoardValidator.validateShipPositions = validateShipPositions;
BoardValidator.boardEquals = boardEquals;
module.exports = BoardValidator;