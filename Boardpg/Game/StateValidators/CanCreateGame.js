/**
 * Checks if a game can be created by a given player
 * 
 * @param sParams
 * @param gameId
 * @param playerId
 * @param cb
 * @param conn
 */
function execute(sParams, gameId, playerId, cb, conn) {
    /**
     * Not sure exactly what needs to get checked here. Maybe check if the player is already in a
     * game? Maybe check if the player is allowed to make games? Idk.
     */
    cb(null, true);
}
module.exports.execute = execute;