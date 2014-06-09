function EventHandlers() {
}

EventHandlers.prototype.createGame = (require('./EventHandlers/CreateGame')).execute;
EventHandlers.prototype.fullStateUpdate = (require('./EventHandlers/FullStateUpdate')).execute;
EventHandlers.prototype.nullEvent = (require('./EventHandlers/NullEvent')).execute;

module.exports = EventHandlers;
