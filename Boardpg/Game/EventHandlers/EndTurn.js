function endTurn()  {
    
}

function endWeek()  {
    
}

function endGame()  {
    
}

function execute(sParams, gameData, playerData, gameId, playerId, cb, conn) {
    endTurn();
    endWeek();
    endGame();
    cb(null, true);
}

module.exports.execute = execute;