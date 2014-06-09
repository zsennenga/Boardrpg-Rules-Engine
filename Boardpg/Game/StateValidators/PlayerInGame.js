/**
 * Checks if a player is in some game before we let them join it.
 * 
 * @param gameId
 * @param playerId
 * @param conn
 * @param cb
 */
function execute(gId, pId, conn, cb) {
    conn.query("SELECT gameId, playerId from " + GLOBAL.PLAYERGAME_TABLE + " where gameId = ? and playerId = ?", [ gId, pId ], function(err,
            res) {
        if (err) {
            cb(err, null);
            return;
        }
        if (res instanceof Array && res[0] instanceof Object && res[0].gameId === gId && res[0].playerId === pId) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
}
module.exports.execute = execute;