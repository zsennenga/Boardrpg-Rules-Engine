'use strict';
function Game(gS, gI) {
	var gameState = gS;
	var gameData = gI;
	var state = require('./State');
	var async = require('async');
}

Game.prototype.getLock(gameId, cb)
{
	this.gameState.getLock(gameId, cb);
}

Game.prototype.releaseLock(gameId, conn, cb)
{
	this.gameState.releaseLock(gameId, conn, cb);
}

Game.prototype.joinGame = function(gameId, playerId, conn) {
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
		if (err)
			throw err;
		else if (res['exists'] && res['active'] && !res['hasPlayer']
				&& !res['isFull']) {
			this.addPlayer(gameId, playerId);
		} else if (!res['exists']) {
			throw "GAME_NOT_EXIST";
		} else if (!res['active']) {
			throw "GAME_INACTIVE";
		} else if (res['hasPlayer']) {
			throw "HAS_PLAYER";
		} else if (res['isFull']) {
			throw "GAME_FULL";
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
