function DBWrapper(d, c) {
    this.db = d;
    this.conf = c;
    this.pool = this.db.createPool({
        connectionLimit : 300,
        user : GLOBAL.DB_USER,
        database : GLOBAL.DATABASE,
        host : GLOBAL.DB_HOST,
        password : GLOBAL.DB_PW
    });
}

DBWrapper.prototype.startTransaction = function(gameId, cb) {
    this.pool.getConnection(function(err, conn) {
        if (err) {
            cb(err, null);
            return;
        }
        conn.query("BEGIN");
        if (gameId) {
            conn.query("SELECT gameId from " + GLOBAL.GAME_TABLE + "WHERE gameId = ? FOR UPDATE", [ gameId ], function(err, res) {
                if (err) {
                    cb(err, null);
                    return;
                }
                cb(null, conn);
            });
        }
        else    {
            cb(null, conn);
        }
    });
};

DBWrapper.prototype.close = function(conn) {
    conn.release();
};

DBWrapper.prototype.rollbackAndClose = function(conn) {
    conn.query("ROLLBACK");
    this.close(conn);
};

DBWrapper.prototype.commitAndClose = function(conn) {
    conn.query("COMMIT");
    this.close(conn);
};

module.exports = DBWrapper;