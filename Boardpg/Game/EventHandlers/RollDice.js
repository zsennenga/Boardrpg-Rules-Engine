function execute(sParams, gameData, gameId, playerId, cb, conn) {
    var data = {};
    data.dieRoll = 0;
    conn.query("SELECT stateData FROM " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(err, data)    {
        if (err)    {
            cb(err, null);
            return;
        }
        var sData = {};
        sData.rollVal = 0;
        
        data = JSON.parse(data[0].stateData);
        
        var min = data.min ? data.min : 1;
        var max = data.max ? data.max : 6;
        var rolls = data.rolls ? data.rolls : 1;
        
        for (var i = 0; i < rolls; i++) {
            sData.rollVal += Math.floor(Math.random() * (max - min + 1)) + min;
        }
        conn.query("UPDATE " + GLOBAL.GAME_TABLE + " SET stateData = ?, currentState = ? WHERE gameId = ?", [JSON.stringify(sData), GLOBAL.state.MOVING, gameId], function(err, res)   {
            if (err)    {
                cb(err, null);
                return;
            }
            cb(null, true);
        });
    });
}

module.exports.execute = execute;