function EventHandlers() {
}

EventHandlers.prototype.combat =            (require('./EventHandlers/Combat')).execute;
EventHandlers.prototype.createGame =        (require('./EventHandlers/CreateGame')).execute;
EventHandlers.prototype.fullStateUpdate =   (require('./EventHandlers/FullStateUpdate')).execute;
EventHandlers.prototype.move =              (require('./EventHandlers/Move')).execute;
EventHandlers.prototype.npc =               (require('./EventHandlers/NPC')).execute;
EventHandlers.prototype.nullEvent =         (require('./EventHandlers/NullEvent')).execute;
EventHandlers.prototype.rollDice =          (require('./EventHandlers/RollDice')).execute;
EventHandlers.prototype.spaceBlank =        (require('./EventHandlers/Space_Blank')).execute;
EventHandlers.prototype.spaceCastle =       (require('./EventHandlers/Space_Castle')).execute;
EventHandlers.prototype.spaceCity =         (require('./EventHandlers/Space_City')).execute;
EventHandlers.prototype.spaceDarkness =     (require('./EventHandlers/Space_Darkness')).execute;
EventHandlers.prototype.spaceMapChange =    (require('./EventHandlers/Space_MapChange')).execute;
EventHandlers.prototype.spaceRoulette =     (require('./EventHandlers/Space_Roulette')).execute;
EventHandlers.prototype.spaceShop =         (require('./EventHandlers/Space_Shop')).execute;
EventHandlers.prototype.useItem =           (require('./EventHandlers/UseItem')).execute;
EventHandlers.prototype.useMagic =          (require('./EventHandlers/UseMagic')).execute;

module.exports = EventHandlers;
