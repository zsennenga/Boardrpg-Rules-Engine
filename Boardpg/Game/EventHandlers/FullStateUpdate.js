function execute(db, gameId, cb) {
    db.startTransaction(null, function(err, conn) {
        if (err) {
            cb(err, null);
            return;
        }
        conn.query("SELECT * FROM " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(error, data) {
            if (error) {
                cb(error, null);
                return;
            }
            cb(null, data);
        });
        
        db.commitAndClose(conn);
    });
}

module.exports.execute = execute;