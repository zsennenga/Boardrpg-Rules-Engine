require('./Data/Config');
require('./Data/State');

var db = require('mysql2')
, io = require('socket.io')
, storage = require('./IO/DB')(db)
, eventData = require('./Data/EventData')
, stateValidators = require('./Game/StateValidators')(storage)
, eventHandlers = require('./Game/EventHandlers')(storage);

io.sockets.on('connection', function(socket) {
	socket.on('gameState', function(data) {
		/**
		 * Check if an eventName was given
		 */
		if (!('eventName' in data)) {
			socket.emit("NO_EVENT");
			return;
		}
		
		/**
		 * Checks if the event actually exists/has handlers
		 */
		if (!(data.eventName in eventData)) {
			socket.emit("INVALID_EVENT");
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
			socket.emit("INVALID_PARAMS");
			return;
		}
		
		/**
		 * Checks if the statehandler for this event exists
		 */
		if (!(stateChecker in stateValidators)) {
			socket.emit("NO_STATE_CHECKER");
			return;
		}
		
		/**
		 * Check if the eventHandler exists
		 */
		if (!(eventHandler in eventHandlers)) {
			socket.emit("NO_EVENT_HANDLER");
			return;
		}
		
		/**
		 * Validates the gamestate before executing the event handler
		 */
		if (!stateValidators.stateChecker(data, socket)) {
			return;
		}
		
		/**
		 * Executes the eventhandler for the event
		 */
		eventHandlers.eventHandler.execute(data, socket);

	});
});

console.log("Ready");