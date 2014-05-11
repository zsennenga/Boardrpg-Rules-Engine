function GameState(sE, s) {
	var store = sE;
	var state = s;
}

/**
 * Gets a lock on the database, needs to be called before any request.
 * 
 * @param gameId
 * @param cb
 */
GameState.prototype.getLock = function(gameId, cb)	{
	this.store.pool.getConnection(function(err, conn)	{
		conn.query("BEGIN TRANSACTION", function(err, res) {
			if (err)	{
				conn.release();
				cb(err, null);
			}
			cb(null, conn);
		});
	});
};

/**
 * Releases a connection after rolling back the transaction.
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
GameState.prototype.releaseLockRollback = function(gameId, conn, cb)	{
	conn.query("ROLLBACK", function(err, res) {
		conn.release();
		cb(null, null);
	});
};

/**
 * Commits a transaction and releases the connection.
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
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
};

/**
 * Checks if the game exists, closed or open
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
GameState.prototype.gameExists = function(gameId, conn, cb) {
	conn.query("SELECT * FROM " +  + " WHERE gameId = ?", [ gameId ], function(
			err, row) {
		if (err)	{
			cb(err, false);
		}
		else if (row.length >= 1)	{
			cb(null, true);
		}
		else	{
			cb(null, false);
		}
	});
};
/**
 * Checks if the game is active, that is, can be joined
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
GameState.prototype.isGameActive = function(gameId, conn, cb) {
	conn.query("SELECT gameState FROM " + + " WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)	{
					cb(err, false);
				}
				else if (row.length === 0)	{
					cb(null, false);
				}
				else if (row[0] !== this.state.closed || row[0] !== this.state.waitingForPlayers)	{
					cb(null, true);
				}
				else	{
					cb(null, false);
				}
			});
};
/**
 * Checks if a player is in a game.
 * 
 * @param gameId
 * @param playerId
 * @param conn
 * @param cb
 */
GameState.prototype.hasPlayer = function(gameId, playerId, conn, cb) {
	conn.query("SELECT players FROM " + + " WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)	{
					cb(err, false);
				}
				else if (row.length === 0)	{
					cb(null, false);
				}
				else {
					if (playerId in JSON.parse(row[0]))	{
						cb(null, true);
					}
					else	{
						cb(null, false);
					}
				}

			});
};
/**
 * Checks if a game is full.
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
GameState.prototype.isFullAndOpen = function(gameId, conn, cb) {
	conn.query("SELECT players, gameState FROM " + +" WHERE gameId = ?", [ gameId ],
			function(err, row) {
				if (err)	{
					cb(err, false);
				}
				else if (row.length === 0)	{
					cb(null, false);
				}
				else if (JSON.parse(row[0]).length < 4  && row[1] === this.state.waitingForPlayers)	{
					cb(null, true);
				}
				else	{
					cb(null, false);
				}
			});
};

module.exports = GameState;