function EventHandlers() {
}

EventHandlers.prototype.combat =            (require('./EventHandlers/Combat')).execute;
EventHandlers.prototype.createGame =        (require('./EventHandlers/CreateGame')).execute;
EventHandlers.prototype.endTurn =           (require('./EventHandlers/EndTurn')).execute;
EventHandlers.prototype.fullStateUpdate =   (require('./EventHandlers/FullStateUpdate')).execute;
EventHandlers.prototype.move =              (require('./EventHandlers/Move')).execute;
EventHandlers.prototype.npc =               (require('./EventHandlers/NPC')).execute;
EventHandlers.prototype.nullEvent =         (require('./EventHandlers/NullEvent')).execute;
EventHandlers.prototype.rollDice =          (require('./EventHandlers/RollDice')).execute;
EventHandlers.prototype.useItem =           (require('./EventHandlers/UseItem')).execute;
EventHandlers.prototype.useMagic =          (require('./EventHandlers/UseMagic')).execute;
EventHandlers.prototype.continueDead =      (require('./EventHandlers/ContinueDead')).execute;

module.exports = EventHandlers;