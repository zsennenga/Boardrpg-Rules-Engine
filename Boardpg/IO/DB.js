function DBWrapper(d, c) {
	this.db = d;
	this.conf = c;
	this.pool = this.db.createPool({
		user : this.conf.user,
		database : this.conf.db,
		host : this.conf.host,
		password : this.conf.pass
	});
}

DBWrapper.prototype.startTransaction = function(gameId, cb) {

};

DBWrapper.prototype.rollbackAndClose = function(conn) {

};

DBWrapper.prototype.commitAndClose = function(conn) {

};

DBWrapper.prototype.close = function(conn) {

};

module.exports = DBWrapper;