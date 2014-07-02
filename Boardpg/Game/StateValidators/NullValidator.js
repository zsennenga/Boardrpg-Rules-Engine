/**
 * Validator that always returns true
 * 
 * @param sParams
 * @param gameId
 * @param playerId
 * @param cb
 * @param conn
 */
function execute(sParams, gameData, gameId, playerId, cb, conn) {
    cb(null, true);
}
module.exports.execute = execute;