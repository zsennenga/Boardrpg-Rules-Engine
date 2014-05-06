'use strict';
function Game(gS, gI)	{
	var gameState = gS;
	var gameInfo = gI;
	var state = require('./State');
}


Game.prototype.gameExists = function(gameId)	{
	return this.gameInfo.gameExists(gameId);
};

Game.prototype.joinGame = function(gameId, playerId)	{
	if (this.gameInfo.isActive(gameId))	{
		
	}
	
	else if (this.gameInfo.hasPlayer(gameId, playerId))	{
		
	}
	
	else if (this.gameInfo.isFull(gameId))	{
		
	}
	
	this.addPlayer(gameId, playerId);
	
};

Game.prototype.addPlayer = function(gameId, playerId)	{
	this.gameState.addPlayer(gameId, playerId);
};

Game.prototype.roll = function(gameId,playerId)	{
	if (!this.gameInfo.isActive(gameId, playerId))	{
		
	}
	
	else if (!this.gameInfo.stateIs(gameId, this.state.board))	{
		
	}
	
	var mods = this.gameInfo.getRollModifiers(gameId,playerId);
	
	var roll = random(mods.min,mods.max)*mods.mult;
	
	this.gameState.setRoll(gameId, roll);
	this.gameState.setState(state.rolled);
};

Game.prototype.useItem = function(gameId, playerId, itemId)	{
	if (!this.gameInfo.isActive(gameId, playerId))	{
		
	}
	
	else if (!this.gameInfo.stateIs(gameId, this.state.board))	{
		
	}
	
	else if (!this.gameInfo.hasItem(gameId, playerId, itemId))	{
		
	}
	
	this.gameState.removeItem(gameId, playerId, itemId);
	this.gameState.useItem(gameId, playerId, itemId);
};

Game.prototype.useFieldMagic = function(gameId, playerId, magicId)	{
	if (!this.gameInfo.isActive(gameId, playerId))	{
		
	}
	
	else if (!this.gameInfo.stateIs(gameId, this.state.board))	{
		
	}
	
	else if (!this.gameInfo.hasMagic(gameId, playerId, magicId))	{
		
	}
	
	this.gameState.removeItem(gameId, playerId, magicId);
	this.gameState.useItem(gameId, playerId, magicId);
};

Game.prototype.canMove = function(gameId, playerId, map, start, end)	{
	if (!this.gameInfo.isActive(gameId, playerId))	{
		
	}
	
	else if (!this.gameInfo.stateIs(gameId, this.state.board))	{
		
	}
	
	var players = this.gameInfo.getPlayersOnSpace(map, start);
	
	if (players.indexOf(playerId) == -1)	{
		
	}
	
	return this.gameInfo.canMove(map, start, end);
};


Game.prototype.move = function(gameId, playerId, map, start, end)	{
	if (!this.gameInfo.isActive(gameId, playerId))	{
		
	}
	
	else if (!this.gameInfo.stateIs(gameId, this.state.board))	{
		
	}
	
	this.gameState.playerMove(map, start, end);

	var spaceHandler = this.gameInfo.getSpaceHandler(end);
	if (typeof Game[spaceHandler] === 'function')	{
		return Game[spaceHandler](gameId, playerId, end);
	}
	else	{
	}
};

Game.prototype.handleitemRoulette = function(gameId, playerId, end)	{
	this.gameInfo.getRoulette(end);
	this.gameState.setState(this.state.rouletteWait);
};

Game.prototype.handleCity = function()	{
	
};

Game.prototype.handleCastle = function()	{
	
};

Game.prototype.handleDarkSpace = function()	{
	
};

Game.prototype.handleMap = function()	{
	
};

Game.prototype.handleBlank = function()	{
	
};

Game.prototype.handleItemShop = function()	{
	
};

Game.prototype.handleWeapShop = function()	{
	
};

Game.prototype.handleMagicShop = function()	{
	
};

Game.prototype.combatOffense = function()	{
	
};

Game.prototype.combatDefense = function()	{
	
};



module.exports = Game;
