function Log(storage) {
	this.db = storage;
}

Log.prototype.startLog = function(ip)	{
	return "";
};

Log.prototype.startEvent = function(event, logId)	{
	
};

Log.prototype.event = function(logId, resp, requestData)	{
    
};

module.exports = Log;