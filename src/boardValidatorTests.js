var chai = require('chai');
var expect = chai.expect;
var boardValidator = require('./boardValidator.js');

// expect(function).to.throw();
const correctPositions = [
      { StartingSquare: { Row: "A", Column: 1 }, EndingSquare : { Row: "A", Column: 5 } },
      { StartingSquare: { Row: "C", Column: 1 }, EndingSquare : { Row: "C", Column: 4 } },
      { StartingSquare: { Row: "E", Column: 1 }, EndingSquare : { Row: "E", Column: 3 } },
      { StartingSquare: { Row: "G", Column: 1 }, EndingSquare : { Row: "G", Column: 3 } },
      { StartingSquare: { Row: "I", Column: 1 }, EndingSquare : { Row: "I", Column: 2 } },
    ];

describe('boardValidator', function () {
    describe('validateShipPositions', function () {
        it ('should throw an error for the wrong number of boats', function () {
            const wrongNum = correctPositions.slice(1,5);
            expect(() => boardValidator.validateShipPositions(wrongNum)).to.throw(/#/);
        })
        it ('should throw an error for placing a boat of the wrong size', function () {
            const badBoat = { 
                StartingSquare: { Row: "A", Column: 1}, 
                EndingSquare: {Row: "A", Column: 9} 
            };
            let wrongSize = correctPositions.slice(1,5)
            wrongSize.push(badBoat);
            expect(() => boardValidator.validateShipPositions(wrongSize)).to.throw(/size/);            
        })
        it ('should throw an error for placing a boat multiple times', function () {
            const dupBoat = { 
                StartingSquare: { Row: "A", Column: 1}, 
                EndingSquare: {Row: "A", Column: 4} 
            };
            const dupBoatList = correctPositions.slice(1,5)
            dupBoatList.push(dupBoat);
            expect(() => boardValidator.validateShipPositions(dupBoatList)).to.throw(/size/);
        })
        it ('should throw an error for placing a nonstraight boat', function () {
            const badBoat = {
                StartingSquare: { Row: "A", Column: 1}, 
                EndingSquare: {Row: "C", Column: 5}                 
            }  
            const badBoatList = correctPositions.slice(1,5)
            badBoatList.push(badBoat);
            expect(() => boardValidator.validateShipPositions(badBoatList)).to.throw(/horizontally/);
        })
        it ('should throw an error for going out of bounds', function () {
            const badBoat = {
                StartingSquare: { Row: "I", Column: 9}, 
                EndingSquare: {Row: "M", Column: 9}                 
            }  
            const badBoatList = correctPositions.slice(1,5)
            badBoatList.push(badBoat);
            expect(() => boardValidator.validateShipPositions(badBoatList)).to.throw(/bounds/);
        })
        it ('should throw an error for overlapping boats', function () {
            const badBoat = {
                StartingSquare: { Row: "E", Column: 2}, 
                EndingSquare: {Row: "I", Column: 2}                 
            }  
            const badBoatList = correctPositions.slice(1,5)
            badBoatList.push(badBoat);
            expect(() => boardValidator.validateShipPositions(badBoatList)).to.throw(/Overlapping/);            
        })
        it ('should throw an error for adjacent boats', function () {
            const badBoat = {
                StartingSquare: { Row: "B", Column: 5}, 
                EndingSquare: {Row: "B", Column: 9}                 
            }  
            const badBoatList = correctPositions.slice(1,5)
            badBoatList.push(badBoat);
            expect(() => boardValidator.validateShipPositions(badBoatList)).to.throw(/Adjacent/);            
        })
        it ('should throw no error for good input', function () {
            expect(() => boardValidator.validateShipPositions(correctPositions)).to.not.throw();
        })
    })

    describe('getBoard', function() {
        it ('should give empty board for empty positions', function () {
            let emptyBoard = [];
            for (let i = 0; i < 10; ++i) {
                let row = [];
                for (let i = 0; i < 10; ++i) {
                    row.push(0);
                }
                emptyBoard.push(row);
            }
            expect(boardValidator.getBoard([])).to.eql(emptyBoard);
        })
        it ('should give same board if start and end squares are switched', function () {
            let switchedCorrectPositions = correctPositions.slice(0,4);
            switchedCorrectPositions.push(
                { StartingSquare: { Row: "I", Column: 2 }, 
                  EndingSquare : { Row: "I", Column: 1 } }
            );
            const result = boardValidator.boardEquals(  boardValidator.getBoard(correctPositions), 
                                                        boardValidator.getBoard(switchedCorrectPositions));
            expect(result).to.be.true;
            
        })
    })
    
})