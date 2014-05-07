'use strict';
function GameState(sE) {
	var store = sE;
}

GameState.prototype.getLock = function(gameId, cb)	{
	this.store.pool.getConnection(err, conn)	{
		conn.query("BEGIN TRANSACTION", function(err, res) {
			if (err)	{
				conn.release();
				cb(err, null);
			}
			cb(null, conn);
		});
	}
	
}

GameState.prototype.releaseLock = function(gameId, conn, cb)	{
	conn.query("COMMIT", function(err, res) {
		if (err)	{
			conn.query("ROLLBACK", function(err, res) {});
			conn.release();
			cb(err, null);
		}
		conn.release();
		cb(null, null);
	});
}

GameState.prototype.gameExists = function(gameId, conn, cb) {
	conn.query("SELECT * FROM " + +" WHERE gameId = ?", [ gameId ], function(
			err, row) {
		if (err)
			cb(err, false);
		else if (rows.length >= 1)
			cb(null, true);
		else
			cb(null, false);
	});
};
GameState.prototype.isGameActive = function(gameId, conn, cb) {
	conn.query("SELECT active FROM " + +" WHERE gameId = ?", [ gameId ],
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
GameState.prototype.hasPlayer = function(gameId, playerId, conn, cb) {
	conn.query("SELECT players FROM " + +" WHERE gameId = ?", [ gameId ],
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
GameState.prototype.isFull = function(gameId, conn, cb) {
	conn.query("SELECT players FROM " + +" WHERE gameId = ?", [ gameId ],
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