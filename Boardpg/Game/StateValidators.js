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

StateValidators.prototype.gameExists = function(gameId, conn, cb) {

};

StateValidators.prototype.playerInGame = function(gameId, playerId, conn, cb) {

};

module.exports = StateValidators;
