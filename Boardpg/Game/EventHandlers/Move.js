function execute(sParams, gameData, gameId, playerId, cb, conn) {
    conn.query("SELECT space FROM " + GLOBAL.PLAYERGAME_TABLE + " WHERE playerId = ? AND gameId = ?", [ playerId, gameId ], function(err, data) {
        if (err) {
            cb(err, null);
            return;
        }

        if (data.length !== 1) {
            cb("INVALID_SPACE_DATABASE", null);
            return;
        }

        var startSpace = data[0].space;

        if (!gameData.board.validatePath(startSpace, sParams.end, sParams.path)) {
            cb("INVALID_MOVEMENT_PATH", null);
            return;
        }

        // TODO Process movement along path, thief etc

        conn.query("UPDATE " + GLOBAL.PLAYERGAME_TABLE + " SET space = ? WHERE playerId = ? and gameId = ?", [ sParams.end, playerId, gameId ],
                function(err, data) {
                    if (err) {
                        cb(err, null);
                        return;
                    }
                    cb(null, true);
                });
    });
}

module.exports.execute = execute;