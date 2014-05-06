'use strict';
function PacketHandler(g)	{
	this.game = g;
}

PacketHandler.prototype.checkAuth = function(socket)	{
	var auth = 0;
	socket.get("auth", function(err, data){
			auth = data;
	});
	
	if (auth === 0)	{
		return false;
	}
	return true;
};

PacketHandler.prototype.checkVars = function(data, vars)	{
	for (var item in vars)	{
		if (typeof data[item] === 'undefined')	{
			return false;
		}
	}
	return true;
};

PacketHandler.prototype.joinGame = function (playerID, gameID)	{
	console.log('Joining game');
	var resp = {};
	if (!this.game.gameExists(gameID))	{
		resp = this.game.createGame(gameID,playerID);
		console.log("Created game with id " + gameID);
		return resp;
	}
	if (this.game.isFull(gameID))	{
		console.log(gameID + " is full");
		return resp;
	}
	
	this.game.addPlayer(gameID,playerID);
	
	return this.game.fullUpdate(gameID);
};

PacketHandler.prototype.auth = function (data)	{
	console.log('Authed');
	return true;
};

PacketHandler.prototype.deauth = function (data)	{
	console.log('Deauthed');
	return true;
};

module.exports = PacketHandler;
