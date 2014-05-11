function PacketHandler(g, s) {
	var game = g;
	var async = require(async);
	var state = s;
}

PacketHandler.prototype.checkAuth = function(socket) {
	var auth = 0;
	socket.get("auth", function(err, data) {
		auth = data;
	});

	if (auth === 0) {
		return false;
	}
	return true;
};

PacketHandler.prototype.checkVars = function(data, vars) {

};

PacketHandler.prototype.joinGame = function(playerID, gameID, socket) {
	this.async.series([ function(callback) {
		this.game.getLock(gameID, callback);
	} ], function(err, res) {
		if (!err) {
			this.async
					.series(
							[
									function(callback) {
										this.game.ActiveAndState(gameID,
												playerID,
												this.state.waitingForPlayers,
												res[0], callback);
									},
									function(callback) {
										this.game.joinGame(gameID, playerID,
												res[0], callback);
									},
									function(callback) {
										this.game.releaseLock(gameID, res[0],
												callback);
									}

							], function(err, res) {

							});
		} else {
			socket.emit(err);
		}
	});
};

PacketHandler.prototype.auth = function(data) {
	console.log('Authed');
	return true;
};

PacketHandler.prototype.deauth = function(data) {
	console.log('Deauthed');
	return true;
};

module.exports = PacketHandler;
