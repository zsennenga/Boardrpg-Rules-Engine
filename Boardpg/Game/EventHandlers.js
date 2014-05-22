function EventHandlers(storage) {
	this.db = storage;
}

EventHandlers.prototype.createGame = require('./EventHandlers/CreateGame')(this.db);

module.exports = EventHandlers;
