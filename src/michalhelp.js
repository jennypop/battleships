var MyBot = require('./MyBot.js');
var MongoClient = require('mongodb').MongoClient;

const localDB = "mongodb://localhost:27017/exampleDb";
const herokuDB = "mongodb://heroku_c5pkfdd9:engufdrjjiuekeig6u7igvaroq@ds157712.mlab.com:57712/heroku_c5pkfdd9";
MongoClient.connect(localDB, function (err, db) {
    if (err) { return console.dir(err); }
    console.log("Connected to server!");
    
    //for (var i = 0; i < 100; i++) {
       runGame(50, db)
    //}
});


function runGame(howLong,db) {
   var shipPositions = MyBot.getShipPositions()
   var state = { MyShots: [] } //If you use more than just your shots, add them to the object
   var shots = []    
   for (var i = 0; i < howLong; i++) {
       MyBot.selectTarget(state, db).then((stuff) => {
           coordinates = stuff[0];
            var shot = {}
            shot.Position = coordinates
            shot.WasHit = checkIfHit(coordinates, shipPositions)
            shots.push(shot)
            state.MyShots = shots
            if (i == howLong) {
                console.log(state.MyShots)
            }
       })        
   }
}
function checkIfHit(coordinates, shipPositions) {
   var hit = false
   shipPositions.forEach((ship) => {
       if (ship.StartingSquare.Row == ship.EndingSquare.Row && (
           coordinates.Row == ship.StartingSquare.Row && (
               (coordinates.Column <= ship.EndingSquare.Column && coordinates.Column >= ship.StartingSquare.Column) ||
               (coordinates.Column >= ship.EndingSquare.Column && coordinates.Column <= ship.StartingSquare.Column))
       )) {
           hit = true
       }        if (ship.StartingSquare.Column == ship.EndingSquare.Column && (
           coordinates.Column == ship.StartingSquare.Column && (
               (coordinates.Row <= ship.EndingSquare.Row && coordinates.Row >= ship.StartingSquare.Row) ||
               (coordinates.Row >= ship.EndingSquare.Row && coordinates.Row <= ship.StartingSquare.Row))
       )) {
           hit = true
       }
   }
   )
   return hit
}