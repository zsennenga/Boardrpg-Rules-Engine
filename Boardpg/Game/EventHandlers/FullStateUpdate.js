/**
 * Get all the gamestate data for a client that is connecting or needs a full update
 * 
 * @param db
 * @param gameId
 * @param cb
 */
function execute(db, gameId, cb) {
    db.startTransaction(null, function(err, conn) {
        if (err) {
            cb(err, null);
            return;
        }
        var resp = {};
        conn.query("SELECT * FROM " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(error1, gameData) {
            if (error1) {
                cb(error1, null);
                return;
            }
            conn.query("SELECT * FROM " + GLOBAL.PLAYERGAME_TABLE + " WHERE gameId = ?", [ gameId ], function(error2, playerData) {
                if (error2) {
                    cb(error2, null);
                    return;
                }
                resp.gameData = gameData;
                var pData = {};
                for (var i = 0; i < playerData.length; i++)  {
                    var pId = playerData[i].playerId;
                    delete playerData[i].playerId;
                    delete playerData[i].gameId;
                    pData[pId] = playerData[i];
                }
                resp.playerData = pData;
                
                cb(null, resp);
            });
        });
        
        db.commitAndClose(conn);
    });
}

module.exports.execute = execute;