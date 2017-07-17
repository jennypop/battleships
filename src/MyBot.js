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
    
    const tracking = db.collection('tracking');
    tracking.remove({}, function(err, removed){
      tracking.insertOne(
        { tracking: false, nextShots: [] , orientation: "", initialSpace: {}, shots: []}, 
        function (err, result) {
            assert.equal(null, err);
            assert.equal(1, result.insertedCount);
        }
      );
      
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

//function getNextTarget(position) {
//  var column = getNextColumn(position.Column);
//  var row = column === 1 ? getNextRow(position.Row) : position.Row;
//  return { Row: row, Column: column }
//}

//function getNextRow(row) {
//  var newRow = row.charCodeAt(0) + 1;
//  if(newRow > 'J'.charCodeAt(0)) {
//    return 'A';
//  }
//  return String.fromCharCode(newRow);
//}

//function getNextColumn(column) {
//  return column % 10 + 1;
//}

function randomFreeSpace (db) {
    const board = db.collection('board');

    const randomFreeSpace = board.aggregate([
        { $match: { Shot: false } },
        { $sample: { size : 1 } }
    ]).toArray();
    return randomFreeSpace;
}

function selectTarget(gamestate, db, resolve) {
    processResult(gamestate, db, resolve);
}

function getNextShot(resolve, trackingObj, db) {
    if (trackingObj && trackingObj.tracking) {
        console.log("found trackingObj", trackingObj);
        if (trackingObj.tracking) {
            findNewShot(resolve, trackingObj.nextShots, db);
        }
    } else {
        resolve(randomFreeSpace(db));
    }
}

function findNewShot(resolve, list, db) {
    if (list.length == 0) { throw new Error("ran out of targets");}
    db.collection('board').findOne({ Row: list[list.length-1].Row, Column: list[list.length-1].Column, Shot: false }, function (err, res) {
        if (res) {
            console.log("resolving!");
            resolve(list[list.length-1]);
        } else {
            console.log("sliceing");
            list.length--;
            console.log(list);
            findNewShot(resolve, list, db);
        }
    });
}

function processResult(gamestate, db, resolve) {
  const board = db.collection('board');
  const tracking = db.collection('tracking');

  if (gamestate.MyShots && gamestate.MyShots.length > 0) {
    const lastShot = gamestate.MyShots[gamestate.MyShots.length - 1];
    console.log(lastShot);
    board.updateOne({Row: lastShot.Position.Row, Column: lastShot.Position.Column}, 
        {$set: { Shot: true, enemyShip: lastShot.WasHit }}, 
        function (err, r) {
            tracking.findOne({}, function (err, trackingObj) {
                if (trackingObj.tracking) {
                    trackingObj = updateTracking(trackingObj, lastShot);
                    tracking.updateOne({}, { $set: { trackingObj } }, function (err, r) {
                        getNextShot(resolve, trackingObj, db);
                    });
                } else if (lastShot.WasHit) {
                    trackingObj = {
                        tracking: true,
                        nextShots: getFirstTrackingShots(lastShot.Position),
                        orientation: "",
                        initialSpace: lastShot.Position,
                        shots: [lastShot.Position]
                    };
                    console.log("started tracking!", JSON.stringify(trackingObj));
                    tracking.updateOne({}, { $set: { trackingObj } }, function (err, r) {
                        getNextShot(resolve, trackingObj, db);
                    });
                } else {
                    getNextShot(resolve, null, db);
                }
            })
        }
    )
  }
}

function updateTracking(trackingObj, lastShot) {
  trackingObj.shots.push(lastShot.Position);
  if (trackingObj.orientation == "" && lastShot.WasHit) {
    trackingObj.orientation = getOrientation(trackingObj.initialSpace, lastShot.Position);
    trackingObj.nextShots = [];
    nextShot1 = getNextShotAlong(trackingObj.initialSpace, lastShot.Position, trackingObj.orientation);
    nextShot2 = getNextShotAlong(lastShot.Position, trackingObj.initialSpace, trackingObj.orientation);
    if (nextShot1 != null) {
      trackingObj.nextShots.push(nextShot1);
    }
    if (nextShot2 != null) {
      trackingObj.nextShots.push(nextShot2);
    }
  } else {
    if (lastShot.WasHit) {
        nextShot1 = getNextShotAlong(trackingObj.initialSpace, lastShot.Position, trackingObj.orientation);
      if (nextShot1 != null) {
        trackingObj.nextShots.push(nextShot1);
      }
    }
    const idxShotRemoved = trackingObj.nextShots.find(
      (shot) => shot.Column == lastShot.Position.Column && shot.Row == lastShot.Position.Row
    );
    trackingObj.nextShots.splice(idxShotRemoved, 1);
  }
  return trackingObj;
}


function getOrientation(shot1, shot2) {
  if (shot1.Column == shot2.Column) {
    return "V"
  } else if (shot1.Row == shot2.Row) {
    return "H"
  } else {
    throw new Error("Asked for orientation of "+ shot1 + ", " + shot2);
  }
}

function getNextShotAlong(shot1, shot2, orientation) {
  if (orientation == "H") {
    if (shot2.Column > shot1.Column) {
      if (shot2.Column == 10) {
        return null;
      } else {
        return { Row: shot2.Row, Column: shot2.Column + 1 };
      }
    } else {
      if (shot2.Column == 1) {
        return null;
      } else {
        return { Row: shot2.Row, Column: shot2.Column - 1 };
      }
    }
  } else {
    if (row2num(shot2.Row) > row2num(shot1.Row)) {
      if (shot2.Row == "J") {
        return null;
      } else {
        return { Row: getNextRow(shot2.Row), Column: shot2.Column };
      }
    } else {
      if (shot2.Row == "A") {
        return null;
      } else {
        return { Row: Board.num2row(Board.row2num(shot2.Row)-1), Column: shot2.Column};
      }
    }
  }
}

function getFirstTrackingShots(shot) {
  let shots = [];
  if (shot.Column < 10) {
    shots.push({ Row: shot.Row, Column: shot.Column+1 });
  }
  if (shot.Column > 1) {
    shots.push({ Row: shot.Row, Column: shot.Column-1 });
  }
  if (shot.Row != "A") {
    shots.push({ Row: Board.num2row(Board.row2num(shot.Row)-2), Column: shot.Column });
  }
  if (shot.Row != "J") {
    shots.push({ Row: Board.num2row(Board.row2num(shot.Row)), Column: shot.Column });
  }
  return shots;
}

module.exports = { 
  dbInit: dbInit,
  getShipPositions: getShipPositions,
  selectTarget: selectTarget
};