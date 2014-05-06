'use strict';
function DBWrapper(d, c)	{
	this.db = d;
	this.conf = c;
	this.conn = this.db.createPool(
		{ user: conf.user, 
		  database: conf.db, 
		  host: conf.host, 
		  password: conf.pass}
		);
}

function 