/**
 * 
 * @param sParams
 * @param gameData
 * @param playerData
 * @param gameId
 * @param playerId
 * @param cb
 * @param conn
 */
function execute(sParams, gameData, playerData, gameId, playerId, cb, conn) {
    playerData.playerActionHandlers.handleEvent("onPass", sParams, gameId, playerId, conn, function(data, error) {
        if (error) {
            cb(error, null);
            return;
        }
    });

    conn.query("UPDATE " + GLOBAL.PLAYERGAME_TABLE + " SET space = ? WHERE playerId = ? and gameId = ?", [ sParams.end, playerId, gameId ], function(
            err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        cb(null, true);
        // TODO handle shit that a space has (traps, temp. bosses, PLAYERS, etc)
        var spaceHandler = gameData.board.getSpace(sParams.end).spaceHandler;
        if (typeof gameData.board[spaceHandler] !== 'function') {
            cb('NO_SPACE_HANDLER', null);
            return;
        }
        gameData.board[spaceHandler](sParams.end, gameData, playerData, gameId, playerId, cb, conn);
    });
}

module.exports.execute = execute;