function execute(gameId, playerId, validStates, requiresActive, cb, conn) {
    conn.query("SELECT activePlayer, currentState from " + GLOBAL.GAME_TABLE + " where gameId = ?", [ gameId ], function(err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        if (requiresActive && data[0].activePlayer !== playerId) {
            cb('NOT_ACTIVE_PLAYER', null);
            return;
        }
        if (validStates.length !== 0 && validStates.indexOf(data[0].currentState) === -1) {
            cb('INVALID_GAME_STATE', null);
            return;
        }

        cb(null, true);
    });

}
module.exports.execute = execute;