function StateValidators() {
}

StateValidators.prototype.checkSocketParams =   (require('./StateValidators/CheckSocketParams')).execute;
StateValidators.prototype.checkState =          (require('./StateValidators/CheckState')).execute;
StateValidators.prototype.nullValidator =       (require('./StateValidators/NullValidator')).execute;
StateValidators.prototype.canCreateGame =       (require('./StateValidators/CanCreateGame')).execute;
StateValidators.prototype.gameExists =          (require('./StateValidators/GameExists')).execute;
StateValidators.prototype.playerInGame =        (require('./StateValidators/PlayerInGame')).execute;
StateValidators.prototype.checkActiveAndState = (require('./StateValidators/CheckActiveAndState')).execute;
StateValidators.prototype.checkMoveSequence =   (require('./StateValidators/CheckMoveSequence')).execute;

module.exports = StateValidators;
