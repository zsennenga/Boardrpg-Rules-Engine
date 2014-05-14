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

module.exports = DBWrapper;