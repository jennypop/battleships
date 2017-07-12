var chai = require('chai');
var assert = chai.assert;
var bot = require('./MyBot.js')

// [ { StartingSquare: {Row, Column}, EndingSquare: {row, column}}, ... ]
function row2num(letter) { return letter.charCodeAt(0) - "A".charCodeAt(0) + 1; }

describe('getShipPositions', function() {
    let pos = bot.getShipPositions();
    it('should place five ships', function () {
        assert.equal(pos.length, 5);
    })
    it('should place each ship horizontally/vertically', function() {
        for (let j = 0; j < pos.length; ++j) {
            assert.isOk(pos[j].StartingSquare.Column == pos[j].EndingSquare.Column 
            || pos[j].StartingSquare.Row == pos[j].EndingSquare.Row);
        }
    })
    it('should place ships of the correct size', function() {
        const correctSizes = [2, 3, 3, 4, 5];
        for (let j = 0; j < pos.length; ++j) {
            const colDiff = Math.abs(pos[j].EndingSquare.Column - pos[j].StartingSquare.Column)+1;
            const rowDiff = Math.abs(pos[j].EndingSquare.Row.charCodeAt(0) 
                                - pos[j].StartingSquare.Row.charCodeAt(0))+1;
            const shipSize = Math.max(colDiff, rowDiff);
            const index = correctSizes.indexOf(shipSize);
            assert.operator(index, '>', -1);
            correctSizes.splice(index, 1);
        }
        assert.equal(correctSizes.length, 0);
    })
    it('should not exceed the bounds of the board', function () {
        for (let j = 0; j < pos.length; ++j) {
            assert.closeTo(pos[j].StartingSquare.Column, 5, 5);
            assert.closeTo(pos[j].EndingSquare.Column, 5, 5);
            assert.closeTo(row2num(pos[j].StartingSquare.Row), 5, 5);
            assert.closeTo(row2num(pos[j].StartingSquare.Row), 5, 5);
        }
    })
    let board = getBoard(pos);
    console.log(board);
    it('should not place ships adjacent to one another', function () {
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
                if (board[i][j] != 0) {
                    assert.isOk(board[i+1][j] == 0 || board[i+1][j] == board[i][j]);
                    assert.isOk(board[i][j+1] == 0 || board[i][j+1] == board[i][j]);
                    assert.isOk(board[i+1][j+1] == 0 || board[i+1][j+1] == board[i][j]);
                }
            }
        }
    })
    xit('should give different layouts when called twice', function () {

    })
    xit('should not place a ship in the exact same location twice in a row', function () {

    })
    xit('should have an even distribution of which squares on the board are occupied', function () {

    })
    xit('should cover a large range of the board', function () {

    })
})

xdescribe('selectTarget', function() {
    it('should not exceed the bounds of the board', function () {

    })

    it('should shoot adjacent if hit', function () {

    })
    it('should not shoot adjacent to a shot-down ship', function () {

    })
})

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
        const startRow = row2num(positions[k].StartingSquare.Row);
        const endRow = row2num(positions[k].EndingSquare.Row);
        const startCol = positions[k].StartingSquare.Column;
        const endCol = positions[k].EndingSquare.Column;
        if (startCol == endCol) {
            if (endRow > startRow) {
                inc = 1;
            } else {
                inc = -1;
            }
            for (let j = startRow; j <= endRow; j += inc) {
                board[j][startCol] = k+1;
            }
        } else {
            if (endCol > startCol) {
                inc = 1;
            } else {
                inc = -1;
            }
            for (let i = startCol; i <= endCol; i += inc) {
                board[startRow-1][i-1] = k+1;
                console.log("did cell ", startRow, i);
            }
        }   
    }
    return board;
}