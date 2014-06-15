function PlayerActionHandlers() {
}

PlayerActionHandlers.prototype.onTurnStart  =   new (require('./PlayerActionHandlers/OnTurnStart'))();
PlayerActionHandlers.prototype.onTurnEnd    =   new (require('./PlayerActionHandlers/OnTurnEnd'))();
PlayerActionHandlers.prototype.onPass       =   new (require('./PlayerActionHandlers/OnPass'))();

module.exports = PlayerActionHandlers;
