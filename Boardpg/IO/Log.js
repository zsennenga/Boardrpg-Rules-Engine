function Log(storage) {
	this.db = storage;
}

Log.prototype.startLog = function(ip)	{
	return "";
};

Log.prototype.startEvent = function(event, logId)	{
	
};

Log.prototype.eventAndEmit = function(eventType, eventResp, eventData, socket, fn, io)	{
    
    if (eventType !== "gameState")    {
        console.log("Emitting non-gamestate data");
        var resp = {};
        resp.code = eventType;
        resp.data = eventResp;
        fn(resp);
    }
    else    {
        io.to(socket.gameId).emit(eventCode, eventData);
    }
};

module.exports = Log;