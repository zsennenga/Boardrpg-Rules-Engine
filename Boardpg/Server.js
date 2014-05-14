require('./Data/Config');
require('./Data/State');
var db = require('mysql2')
  , io = require('socket.io')
  , storage = require('./IO/DB')(db)
  , eventData = require('./Data/EventData')
  , stateValidators = require('./Game/StateValidators')(storage)
  , eventHandlers = require('./Game/EventHandlers')(storage);

io.sockets.on('connection', function(socket) {
	socket.on('gameState', function(data)	{
		if (!('eventName' in data))	{
			socket.emit("NO_EVENT");
			return;
		}
		
		if (!(data.eventName in eventData))	{
			socket.emit("INVALID_EVENT");
			return;
		}
		
		var event = eventData[data.eventName];
		var stateChecker = event.stateChecker;
		var eventHandler = event.handler;
		
		if (!stateValidators.checkSocketParams(event.socketParams, data))	{
			socket.emit("INVALID_PARAMS");
			return;
		}
		
		if (!(stateChecker in stateValidators))	{
			socket.emit("NO_STATE_CHECKER");
			return;
		}
		
		if (!(eventHandler in eventHandlers))	{
			socket.emit("NO_EVENT_HANDLER");
			return;
		}
		
		if (!stateValidators.stateChecker(data, socket))	{
			return;
		}
		
		eventHandlers.eventHandler.execute(data, socket);
		
	});
});

console.log("Ready");