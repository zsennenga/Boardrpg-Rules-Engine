/**
 * Checks if the game is in one of a specified set of states
 * 
 * @param states
 * @param gameId
 * @param conn
 * @param cb
 */
function execute(states, gameId, conn, cb) {
    if (states === []) {
        cb(null, true);
    }

    conn.query("SELECT gameState from " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(err, res) {

    });
}
module.exports.execute = execute;