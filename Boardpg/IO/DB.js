function DBWrapper(d, c) {
	this.db = d;
	this.conf = c;
	this.pool = this.db.createPool({
		user : GLOBAL.DB_USER,
		database : GLOBAL.DATABASE,
		host : GLOBAL.DB_HOST,
		password : GLOBAL.DB_PW
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