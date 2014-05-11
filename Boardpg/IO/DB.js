function DBWrapper(d, c) {
	var db = d;
	var conf = c;
	var conn = this.db.createPool({
		user : this.conf.user,
		database : this.conf.db,
		host : this.conf.host,
		password : this.conf.pass
	});
}