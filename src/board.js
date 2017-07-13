function Board() {}

var num2row = function (num) { return String.fromCharCode("A".charCodeAt(0) + num);  }

var row2num = function (letter) { return letter.charCodeAt(0) - "A".charCodeAt(0) + 1; }

var adjacentSquareValues = function (row, col, board) {
    const rowAbove = Math.max(row-1, 0);
    const colLeft = Math.max(col-1, 0);
    const rowBelow = Math.min(row+1, 9);
    const colRight = Math.min(col+1, 9);

    return [
        board[rowAbove][colLeft], board[rowAbove][col], board[rowAbove][colRight], 
        board[row][colLeft],                            board[row][colRight], 
        board[rowBelow][colLeft], board[rowBelow][col], board[rowBelow][colRight] 
    ];
}

var checkSquare = function (value, row, col, board) {
    if (board[row][col] != 0) {
        throw new Error(`Overlapping boats at row ${row}, col ${col}!`);
    }
    const adjacentSquares = adjacentSquareValues(row, col, board);
    if (adjacentSquares.some((num) => { num != 0 && num != value;}
        )) {
        throw new Error(`Adjacent boat placement at row ${row+1}, col ${col+1}`);
    }
}

var initBoard = function () {
    let board = [];
    for (let i = 0; i < 10; ++i) {
        let row = [];
        for (let i = 0; i < 10; ++i) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

var updateBoard = function (board, position, shipNum) {
    let startRow = row2num(position.StartingSquare.Row)-1;
    let endRow = row2num(position.EndingSquare.Row)-1;
    let startCol = position.StartingSquare.Column-1;
    let endCol = position.EndingSquare.Column-1;
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

Board.getBoard = function (positions) {
    let board = initBoard();
    for (let k = 0; k < positions.length; ++k) {
        updateBoard(board, positions[k], k+1);
    }
    return board;
}

Board.boardEquals = function (board1, board2) {
    for (i = 0; i < 10; ++i) {
        for (j = 0; j < 10; ++j) {
            if ((board1[i][j] == 0) != (board2[i][j] == 0)) {
                return false;
            }
        }
    }
    return true;
}

Board.testClear = function (row, col, orientation, shipSize, board) {
    if (orientation == "H") {
        for (let i = 0; i < shipSize; ++i) {
            if (board[row][col+i] != 0) {
                return false;
            }
        }
    } else {
        for (let i = 0; i < shipSize; ++i) {
            if (board[row+i][col] != 0) {
                return false;
            }
        }
    }
    return true;
}

Board.updateBoardValidSpaces = function (row, col, orientation, shipSize, board) {
    if (orientation == "H") {
        for (let i = 0; i < shipSize; ++i) {
            const rowAbove = Math.max(row-1, 0);
            const colLeft = Math.max(col+i-1, 0);
            const rowBelow = Math.min(row+1, 9);
            const colRight = Math.min(col+i+1, 9);
            const thisCol = col+i;
            const thisRow = row;
            board[rowAbove][colLeft] = 1; board[rowAbove][thisCol] = 1; board[rowAbove][colRight] = 1; 
            board[thisRow][colLeft] = 1;  board[thisRow][thisCol] = 1;  board[thisRow][colRight] = 1; 
            board[rowBelow][colLeft] = 1; board[rowBelow][thisCol] = 1; board[rowBelow][colRight] = 1;
        }
        return board;
    } else {
        for (let i = 0; i < shipSize; ++i) {
            const rowAbove = Math.max(row+i-1, 0);
            const colLeft = Math.max(col-1, 0);
            const rowBelow = Math.min(row+i+1, 9);
            const colRight = Math.min(col+1, 9);
            const thisCol = col;
            const thisRow = row+i;
            board[rowAbove][colLeft] = 1; board[rowAbove][thisCol] = 1; board[rowAbove][colRight] = 1; 
            board[thisRow][colLeft] = 1;  board[thisRow][thisCol] = 1;  board[thisRow][colRight] = 1; 
            board[rowBelow][colLeft] = 1; board[rowBelow][thisCol] = 1; board[rowBelow][colRight] = 1;
        }
        return board;
    }

}

Board.num2row = num2row;
Board.row2num = row2num;
Board.initBoard = initBoard;
Board.updateBoard = updateBoard;

module.exports = Board;