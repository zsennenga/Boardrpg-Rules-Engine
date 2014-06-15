function execute(sParams, gameData, playerAction, gameId,  playerId, cb, conn) {
    // Need to iron out the schema
    conn.query('INSERT INTO ' + GLOBAL.GAME_TABLE + ' VALUES ()', function(err, res) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, res.insertId);
        }
    });
}

module.exports.execute = execute;