define([
  // Libs
  "jquery"
], function ($) {
  return (
    class Game {
      constructor(gameParms) {
        // Number of players that will play in the game.
        // Includes NPCs if any.
        this._numberOfPlayers = gameParms.players || 5;
        // YYYY
        this._startYear = gameParms.startYear || 2019;
        // MM - month number
        this._startMonth = gameParms.startMonth || 01;
        // How many months go buy in a turn. One month is 
        // lowest interval.
        this._turnInterval = gameParms.turnInterval || 3;
        // Number of turns before game ends. 0 means infinate.
        this._totalTurnsInGame = gameParms.totalTurns || 0;
        // The current turn in the game. 
        this._currentTurn = gameParms.currentTurn || 0;
      }

      // returns date in string form: YYYYMM
      getCurrentTurnDate() {
        let currentYear = startYear + Math.floor(this._startMonth + (this._currentTurn * this._turninterval)) / 12;
        let currentMonth = (startMonth + (this._currentTurn * this._turninterval)) % 12;
        //return
      }
    });
});
