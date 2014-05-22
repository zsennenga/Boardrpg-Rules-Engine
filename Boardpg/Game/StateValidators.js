function StateValidators(storage) {
	this.db = storage;
}

/**
 * Check that the data array has all the fields necessary
 * 
 * @param params
 * @param data
 * @returns {Boolean}
 */
StateValidators.prototype.checkSocketParams = function(params, data) {
	if (params.length === 0) {
		return true;
	}
	for ( var param in params) {
		if (!(param in data)) {
			return false;
		}
	}

	return true;
};

StateValidators.prototype.checkState = function(states, gameId, conn, cb) {
	if (states === []) {
		cb(null, true);
	}

	conn.query("SELECT gameState from " + GLOBAL.GAME_TABLE + " WHERE gameId = ?",
			[ gameId ], function(err, res) {

			});
};

StateValidators.prototype.genericValidator = function(sParams, gameId,
		playerId, cb, conn) {
	cb(null, true);
};

StateValidators.prototype.canCreateGame = function(sParams, gameId, playerId,
		cb, conn) {
	/**
	 * Not sure exactly what needs to get checked here. Maybe check if the
	 * player is already in a game? Maybe check if the player is allowed to make
	 * games? Idk.
	 */
	cb(null, true);
};

StateValidators.prototype.gameExists = function(gameId, conn, cb) {
	conn.query("SELECT gameId from " + GLOBAL.GAME_TABLE
			+ " where gameId = ?"[gameId], function(err, res) {
		if (err) {
			cb(err, null);
		}
		if (res instanceof 'array' && res[0].gameId === gameId) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	});
};

StateValidators.prototype.playerInGame = function(gameId, playerId, conn, cb) {
	conn.query("SELECT players from " + GLOBAL.GAME_TABLE
			+ " where gameId = ?"[gameId], function(err, res) {
		if (err) {
			cb(err, null);
		}
		if (res instanceof 'array') {
			var players = JSON.parse(res[0].players);
			if (players.indexOf(playerId) >= 0) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		} else {
			cb(null, false);
		}
	});
};

module.exports = StateValidators;
