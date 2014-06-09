/**
 * Checks if a game exists before we let you join it.
 * 
 * @param gameId
 * @param conn
 * @param cb
 */
function execute(gameId, conn, cb) {
    conn.query("SELECT gameId from " + GLOBAL.GAME_TABLE + " where gameId = ?", [ gameId ], function(err, res) {
        if (err) {
            cb(err, null);
            return;
        }
        if (res !== undefined && res instanceof Array && res[0] !== undefined && res[0].gameId === gameId) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
}
module.exports.execute = execute;