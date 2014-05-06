'use strict';
var config = require('./config')
  , db = require('mysql2')
  , storage = require('./IO/DB')(db)
  , gameState = require('./Game/GameState')(storage)
  , gameInfo = require('./Game/GameInfo')(storage)
  , game = require('./Game/Game')(gameState,gameInfo)
  , packetHandler = require('./IO/PacketHandler')(game)
  , io = require('socket.io');

io.sockets.on('connection', function (socket) {});

console.log("Ready");