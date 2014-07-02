function execute(sParams, gameData, gameId, playerId, cb, conn) {
    conn.query("SELECT stateData FROM " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(err, data) {
        if (err) {
            cb(err, null);
            return;
        }

        if (data.length !== 1) {
            cb("INVALD_STATE_DATA", null);
            return;
        }
        
        data = JSON.parse(data[0].stateData);

        if (data.rollVal + 1 !== sParams.path.length) {
            console.log(data.stateData.rollVal + 1 + " " + sParams.path.length);
            cb("INVALID_MOVE_COUNT", null);
            return;
        }

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
            sParams.startSpace = startSpace;
            cb(null, true);
        });

    });
}
module.exports.execute = execute;