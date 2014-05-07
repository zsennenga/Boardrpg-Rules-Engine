'use strict';
var config = require('./config')
  , db = require('mysql2')
  , storage = require('./IO/DB')(db)
  , gameState = require('./Game/GameState')(storage)
  , gameData = require('./Game/GameData')(storage)
  , game = require('./Game/Game')(gameState,gameData)
  , packetHandler = require('./IO/PacketHandler')(game)
  , io = require('socket.io');

io.sockets.on('connection', function (socket) {
	
});

console.log("Ready");