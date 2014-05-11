var config = require('./config')
  , db = require('mysql2')
  , storage = require('./IO/DB')(db)
  , state = require('./Game/State')()
  , gameState = require('./Game/GameState')(storage)
  , gameData = require('./Game/GameData')(storage)
  , game = require('./Game/Game')(gameState,gameData)
  , packetHandler = require('./IO/PacketHandler')(game)
  , io = require('socket.io')
  , async = require('async');

io.sockets.on('connection', function(socket) {
	socket.on('joinGame', function(data)	{
		packetHandler.joinGame(data[0], data[1], socket);
	});
});

console.log("Ready");