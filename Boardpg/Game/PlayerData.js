function PlayerData(storage) {
    this.db = storage;
}

PlayerData.prototype.playerActionHandlers = new (require('./PlayerActionHandlers'))();

PlayerData.prototype.auth = function(playerId, auth, cb) {
    cb(true);
};

module.exports = PlayerData;
