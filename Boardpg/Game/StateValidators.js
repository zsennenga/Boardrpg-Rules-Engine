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
	for ( var param in params) {
		if (!(param in data)) {
			return false;
		}
	}

	return true;
};

StateValidators.prototype.genericValidator = function(sParams, gameId,
		playerId, cb, conn) {
	cb(null, true);
};

StateValidators.prototype.canCreateGame = function(sParams, gameId, playerId,
		cb, conn) {
	/**
	 * Not sure exactly what needs to get checked here.
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
