function EventHandlers(storage) {
	this.db = storage;
}

EventHandlers.prototype.createGame = (require('./EventHandlers/CreateGame')).execute;
EventHandlers.prototype.fullStateUpdate = (require('./EventHandlers/FullStateUpdate')).execute;

module.exports = EventHandlers;
