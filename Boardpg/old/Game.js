function Game(gS, gI) {
	var gameState = gS;
	var gameData = gI;
	var state = require('./State');
	var async = require('async');
}

/**
 * Locks the database for the row with gameID = gameId "Returns" the connection
 * used for the lock. Also begins a transaction.
 * 
 * @param gameId
 * @param cb callback from async.js
 */
Game.prototype.getLock = function(gameId, cb) {
	this.gameState.getLock(gameId, cb);
};

/**
 * Releases the lock on a given database row and rolls back the transaction.
 * @param gameId
 * @param conn
 * @param cb
 */
Game.prototype.releaseLockErr = function(gameId, conn, cb) {
	this.gameState.releaseLockRollback(gameId, conn, cb);
};

/**
 * Releases the lock and commits the transaction.
 * 
 * @param gameId
 * @param conn
 *            mysql connection from getLock
 * @param cb
 *            callback from async.js
 */
Game.prototype.releaseLock = function(gameId, conn, cb) {
	this.gameState.releaseLock(gameId, conn, cb);
};
/**
 * Check if the active player is the one given or if the state is one of the
 * ones listed in state. State accepts arrays.
 * 
 * 
 * @param gameId
 * @param playerId
 * @param state
 * @param conn
 *            mysql connection from getLock
 * @param cb
 *            callback from async.js
 */
Game.prototype.activeAndState = function(gameId, playerId, state, conn, cb) {
	this.async.parallel({
		activeAndState : function(callback) {
			this.gameState.getActivityAndState(gameId, conn, callback);
		}
	}, function(err, res) {
		if (typeof state !== 'object') {
			state = [ state ];
		}
		if (res.activeAndState.active === 1	&& state.indexOf(res.activeAndState.state) > -1) {
			cb(null, true);
		}
		else	{
			cb("GAME_NOT_WAITING", false);
		}
	});
};

/**
 * This joins a player to a game if it meets the conditions of: Existence Not
 * finished/canceled Not full Doesn't already have the player in question
 * 
 * @param gameId
 * @param playerId
 * @param conn
 *            mysql connection from getLock
 * @param cb
 *            callback from async.js
 */
Game.prototype.joinGame = function(gameId, playerId, conn, cb) {
	this.async.parallel({
		exists : function(callback) {
			this.gameState.gameExists(gameId, conn, callback);
		},
		active : function(callback) {
			this.gameState.isGameActive(gameId, conn, callback);
		},
		hasPlayer : function(callback) {
			this.gameState.hasPlayer(gameId, playerId, conn, callback);
		},
		isFull : function(callback) {
			this.gameState.isFull(gameId, conn, callback);
		}
	}, function(err, res) {
		if (err) {
			cb(err, false);
		} else if (res.exists && res.active && !res.hasPlayer && !res.isFull) {
			this.addPlayer(gameId, playerId);
			cb(null, true);
		} else if (!res.exists) {
			cb("GAME_NOT_EXIST", false);
		} else if (!res.active) {
			cb("GAME_INACTIVE", false);
		} else if (res.hasPlayer) {
			cb("HAS_PLAYER", false);
		} else if (res.isFull) {
			cb("GAME_FULL", false);
		}
	}

	);

};

Game.prototype.roll = function(gameId, playerId) {

};

Game.prototype.useItem = function(gameId, playerId, itemId) {

};

Game.prototype.useFieldMagic = function(gameId, playerId, magicId) {

};

Game.prototype.canMove = function(gameId, playerId, map, start, end) {

};

Game.prototype.move = function(gameId, playerId, map, start, end) {

};

Game.prototype.handleitemRoulette = function(gameId, playerId, end) {

};

Game.prototype.handleCity = function() {

};

Game.prototype.handleCastle = function() {

};

Game.prototype.handleDarkSpace = function() {

};

Game.prototype.handleMap = function() {

};

Game.prototype.handleBlank = function() {

};

Game.prototype.handleItemShop = function() {

};

Game.prototype.handleWeapShop = function() {

};

Game.prototype.handleMagicShop = function() {

};

Game.prototype.combatOffense = function() {

};

Game.prototype.combatDefense = function() {

};

module.exports = Game;
