function PlayerData(storage) {
    this.db = storage;
}

PlayerData.prototype.auth = function(playerId, auth, cb) {
    cb(true);
};

module.exports = PlayerData;
