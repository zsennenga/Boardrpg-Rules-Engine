function GameData() {
}

GameData.prototype.board =              new (require('./GameData/Board'))();
GameData.prototype.castles =            new (require('./GameData/Castles'))();
GameData.prototype.cities =             new (require('./GameData/Cities'))();
GameData.prototype.classes =            new (require('./GameData/Classes'))();
GameData.prototype.encounterList =      new (require('./GameData/EncounterList'))();
GameData.prototype.fieldMagic =         new (require('./GameData/FieldMagic'))();
GameData.prototype.gear =               new (require('./GameData/Gear'))();
GameData.prototype.items =              new (require('./GameData/Items'))();
GameData.prototype.monsters =           new (require('./GameData/Monsters'))();
GameData.prototype.skills =             new (require('./GameData/Skills'))();

module.exports = GameData;