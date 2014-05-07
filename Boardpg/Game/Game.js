'use strict';
function Game(gS, gI) {
	var gameState = gS;
	var gameInfo = gI;
	var state = require('./State');
	var async = require('async');
}

Game.prototype.getLock(gameId, cb)
{
	this.gameState.getLock(gameId, cb);
}

Game.prototype.releaseLock(gameId, cb)
{
	this.gameState.releaseLock(gameId, cb);
}

Game.prototype.joinGame = function(gameId, playerId) {
	this.async.parallel({
		exists : function(callback) {
			this.gameInfo.gameExists(gameId);
		},
		active : function(callback) {
			this.gameInfo.isGameActive(gameId, callback);
		},
		hasPlayer : function(callback) {
			this.gameInfo.hasPlayer(gameId, playerId, callback);
		},
		isFull : function(callback) {
			this.gameInfo.isFull(gameId, callback);
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
