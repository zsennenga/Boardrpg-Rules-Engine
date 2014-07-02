function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function execute(endSpace, gameData, playerAction, gameId, playerId, cb, conn) {
    var spaceData = gameData.board.getSpace(endSpace);
    var encounterList = gameData.encounterList.getList(spaceData.encounterList);
    var selectionList = encounterList.combatEncounter;

    var roll = getRandomInt(0, 100);

    if (roll < encounterList.randomEventThreshold) {
        selectionList = encounterList.randomEncounter;
    }

    var executedEvent;
    var i = 0;

    for (roll = getRandomInt(0, 100); roll > 0; roll) {
        executedEvent = selectionList[i];
        roll = roll - executedEvent.chance;
        i++;
    }

    var eventData = null;

    if (executedEvent.encounterClass === "NPC") {
        eventData = gameData.npc.getNPC(executedEvent.entityId);

    } else {
        eventData = gameData.monster.getMonster(executedEvent.entityId);
    }

    conn.query("SELECT stateData FROM " + GLOBAL.GAME_TABLE + " WHERE gameId = ?", [ gameId ], function(err, data) {
        if (err) {
            cb(err, null);
            return;
        }

        var stateData = JSON.parse(data[0].stateData);

        stateData.encounterData = eventData;
        stateData.encounterClass = executedEvent.encounterClass;

        conn.query("UPDATE " + GLOBAL.GAME_TABLE + " SET currentState = ?, stateData = ? WHERE gameId = ?", [ executedEvent.newState,
                JSON.stringify(stateData), gameId ], function(error2, data) {
            if (error2) {
                cb(error2, null);
                return;
            }

            cb(null, true);
        });
    });

}
module.exports.execute = execute;