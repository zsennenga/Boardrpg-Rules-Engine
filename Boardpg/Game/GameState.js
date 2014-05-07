'use strict';
function GameState(sE) {
	var store = sE;
}

GameState.prototype.gameExists = function(gameId, cb) {
	this.store.query("SELECT * FROM " + +" WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)
					cb(err, false);
				else if (rows.length >= 1)
					cb(null, true);
				else
					cb(null, false);
			});
};
GameState.prototype.isGameActive = function(gameId, cb) {
	this.store.query("SELECT active FROM " + +" WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)
					cb(err, false);
				else if (row.length == 0)
					cb(null, false);
				else if (row[0] === 1)
					cb(null, true);
				else
					cb(null, false);

			});
};
GameState.prototype.hasPlayer = function(gameId, playerId, cb) {
	this.store.query("SELECT players FROM " + +" WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)
					cb(err, false);
				else if (row.length == 0)
					cb(null, false);
				else {
					if (playerId in row[0])
						cb(null, true);
					else
						cb(null, false);
				}

			});
};
GameState.prototype.isFull = function(gameId, cb) {
	this.store.query("SELECT players FROM " + +" WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)
					cb(err, false);
				else if (row.length == 0)
					cb(null, false);
				else if (row[0].length < 4)
					cb(null, true);
				else
					cb(null, false);

			});
};

module.exports = GameState;