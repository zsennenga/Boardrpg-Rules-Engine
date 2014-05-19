require('./Data/Config');
require('./Data/State');

var eventData = JSON.parse('./Data/EventData.json');

var db = require('mysql2');
var io = require('socket.io');
var async = require('async');
var storage = require('./IO/DB')(db);
var playerData = require('./Game/PlayerData')(storage);
var gameData = require('./Game/GameData');
var stateValidators = require('./Game/StateValidators')(storage);
var eventHandlers = require('./Game/EventHandlers')(storage);

io.sockets.on('connection', function(socket) {

	socket.auth = false;
	socket.playerId = null;
	socket.gameId = null;

	/**
	 * This handles all the logic that interacts with, or 
	 * draws information from, the gamestate.
	 * 
	 * If you get to this point, we assume you 
	 * A) Have authenticated
	 * B) Have joined a game
	 * 
	 * We do CHECK those things, but these are the sorts of 
	 * actions considered "not part of the gamestate"
	 */
	socket.on('gameState', function(data) {
		if (!socket.auth) {
			socket.emit('error', 'NO_AUTH');
			return;
		}
		if (!socket.gameId) {
			socket.emit('error', 'NO_GAME');
			return;
		}
		/**
		 * Check if an eventName was given
		 */
		if (!('eventName' in data)) {
			socket.emit('error', 'NO_EVENT');
			return;
		}

		/**
		 * Checks if the event actually exists/has handlers
		 */
		if (!(data.eventName in eventData)) {
			socket.emit('error', 'INVALID_EVENT');
			return;
		}

		var event = eventData[data.eventName];
		var stateChecker = event.stateChecker;
		var eventHandler = event.handler;

		/**
		 * Check if the socket data contains the parameters necessary to execute
		 * the request
		 */
		if (!stateValidators.checkSocketParams(event.socketParams, data)) {
			socket.emit('error', 'INVALID_GAMESTATE_PARAMS');
			return;
		}

		/**
		 * Checks if the statehandler for this event exists
		 */
		if (!(stateChecker in stateValidators)) {
			socket.emit('error', 'NO_STATE_CHECKER');
			return;
		}

		/**
		 * Check if the eventHandler exists
		 */
		if (!(eventHandler in eventHandlers)) {
			socket.emit('error', 'NO_EVENT_HANDLER');
			return;
		}
		/**
		 * Perform the following tasks in series 
		 * 1. Get a connection with an
		 * active transaction, lock the row if necessary 
		 * 2. Pass the transaction to another series of tasks 
		 * 		1. Check the gameState is correct for the
		 * 		given event 
		 * 		2. Make the change in gameState necessary. 
		 * 		3a. If error, rollback the transaction and close the connection 
		 * 		3b. If no error, commit the transaction and close the connection
		 * 
		 * This is managed by async.js.
		 * 
		 * callback is a function of the form callback(error, result)
		 * 
		 * If error is not set then the function is assumed successful.
		 * 
		 * If error IS set then the function immediate executes the final
		 * callback, which simply emits the error id. Error ids are translated
		 * to strings at the client. They are of the form error_MESSAGE.
		 * 
		 * If there is no error, an object is returned which has any updates
		 * necessary to the gamestate.
		 * 
		 * This structure is used by many of the packet events, just because
		 * getting a lock on the row is so critical.
		 */
		async.series([ function(callback) {
			//Get Connection
			storage.startTransaction(socket.gameId, callback);
		} ], function(err, res) {
			if (err) {
				socket.emit('error', err);
				return;
			}
			//Pass to next set of tasks
			var conn = res[0];
			async.series([
					function(callback) {
						//Validate GameState
						stateValidators.stateChecker(data, socket.gameId,
								socket.playerId, callback, conn);
					},
					function(callback) {
						//Execute event Handler
						eventHandlers.eventHandler.execute(data, socket.gameId,
								socket.playerId, callback, conn);
					} ], function(error) {
				if (error) {
					storage.rollbackAndClose(conn);
					socket.emit('error', error);
				} else {
					storage.commitAndClose(conn);
					socket.emit('gameState', res[1]);
				}
			});
		});

	});

	/**
	 * A player needs to authenticate their socket with our backend before we
	 * want them to do anything.
	 * 
	 * They do this by giving us their playerId and some to-be-determined
	 * session value. This persists as long as the socket is open.
	 */
	socket.on('authenticate', function(data) {
		if (!('playerId' in data) || !('auth' in data)) {
			socket.emit('error', 'INVALID_AUTH_PARAMS');
		}
		playerData.auth(data.playerId, data.auth, function(status, resp) {
			socket.auth = status;
			if (status) {
				socket.playerId = data.playerId;
			}
			socket.emit('gameState', resp);
		});
	});

	/**
	 * Each Socket is good for only 1 game. So you must set the game your socket
	 * is for before you can issue any other commands, except authenticate,
	 * which is required to join a game. '
	 */
	socket.on('setGame', function(data) {
		if (!socket.auth) {
			socket.emit('error', 'NO_AUTH');
		}
		if (!('gameId' in data)) {
			socket.emit('error', 'INVALID_JOIN_PARAMS');
		}
		/**
		 * 1. Get a connection
		 * 2. Execute all the validators
		 * 3. Close connection
		 * 4. Check if validators returned true
		 */
		async.series([ function(callback) {
			//Get Connection
			storage.startTransaction(data.gameId, callback);
		} ], function(err, res) {
			if (err) {
				socket.emit('error', err);
				return;
			}
			//Pass to next set of tasks
			var conn = res[0];
			async.parallel({
				exists : function(callback) {
					//Validate GameState
					stateValidators.gameExists(data.gameId, conn, callback);
				},
				playerInGame : function(callback) {
					//Execute event Handler
					stateValidators.playerInGame(data.gameId, socket.playerId,
							conn, callback);
				}
			}, function(error, res) {
				storage.commitAndClose(conn);
				if (error) {
					socket.emit('error', error);
					return;
				}
				if (!res.exists) {
					socket.emit('error', 'GAME_NOT_EXIST');
					return;
				}
				if (!res.playerInGame) {
					socket.emit('error', 'PLAYER_NOT_IN_GAME');
				}

				socket.gameId = data.gameId;
				socket.emit('gameState', res);
			});
		});
	});

});

console.log('Ready');