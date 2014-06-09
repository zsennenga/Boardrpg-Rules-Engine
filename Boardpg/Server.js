require('./Data/Config');
require('./Data/State');

var eventData = require('./Data/EventData.js').eventData;

var db = require('mysql2');
var socketsIO = require('socket.io');
var async = require('async');
var storage = new (require('./IO/DBWrapper'))(db);
var playerData = new (require('./Game/PlayerData'))(storage);
var gameData = require('./Game/GameData');
var stateValidators = new (require('./Game/StateValidators'))(storage);
var eventHandlers = new (require('./Game/EventHandlers'))(storage);
var log = new (require('./IO/Log'))(storage);
var util = require('./Common/Util.js');

var io = socketsIO();

io.attach(8080);

io.sockets.on('connection', function(socket) {

    console.log("Got connection from " + socket.handshake.address.address);

    socket.auth = false;
    socket.playerId = null;
    socket.gameId = null;
    socket.logId = log.startLog(socket.handshake.address.address);
    socket.logEventId = null;

    /**
     * This handles all the logic that interacts with, or draws information from, the gamestate.
     * 
     * If you get to this point, we assume you A) Have authenticated B) Have joined a game
     * 
     * We do CHECK those things, but these are the sorts of actions considered "not part of the
     * gamestate"
     */
    socket.on('gameState', function(data, fn) {
        data = util.tryParseJson(data);
        var resp = util.format('error', '');
        if ('gD' in data) {
            resp.data = 'INVALID_JSON';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        console.log("Got data in gameState " + data);
        socket.logEventId = log.startEvent('gameState', socket.logId);
        if (!socket.auth) {
            resp.data = 'NO_AUTH';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        if (!socket.gameId) {
            resp.data = 'NO_GAME_SET';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        /**
         * Check if an eventName was given
         */
        if (!('eventName' in data)) {
            resp.data = 'NO_EVENT';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }

        /**
         * Checks if the event actually exists/has handlers
         */
        if (!(data.eventName in eventData)) {
            resp.data = 'INVALID_EVENT';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }

        var event = eventData[data.eventName];
        var validStates = event.validStates;
        var stateChecker = event.stateChecker;
        var eventHandler = event.handler;

        /**
         * Check if the socket data contains the parameters necessary to execute the request
         */
        if (!stateValidators.checkSocketParams(event.socketParams, data)) {
            resp.data = 'INVALID_GAMESTATE_PARAMS';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }

        /**
         * Checks if the statehandler for this event exists
         */
        if (!(stateChecker in stateValidators)) {
            resp.data = 'NO_STATE_CHECKER';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }

        /**
         * Check if the eventHandler exists
         */
        if (!(eventHandler in eventHandlers)) {
            resp.data = 'NO_EVENT_HANDLER';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        /**
         * Perform the following tasks in series
         * 
         * 1. Get a connection with an active transaction, lock the row if necessary
         * 
         * 2. Pass the transaction to another series of tasks
         * 
         * 1. Check the gameState is correct for the given event 2. Make the change in gameState
         * necessary. 3a. If error, rollback the transaction and close the connection 3b. If no
         * error, commit the transaction and close the connection
         * 
         * This is managed by async.js.
         * 
         * callback is a function of the form callback(error, result)
         * 
         * If error is not set then the function is assumed successful.
         * 
         * If error IS set then the function immediate executes the final callback, which simply
         * emits the error id. Error ids are translated to strings at the client. They are of the
         * form error_MESSAGE.
         * 
         * If there is no error, an object is returned which has any updates necessary to the
         * gamestate.
         * 
         * This structure is used by many of the packet events, just because getting a lock on the
         * row is so critical.
         */
        async.series([ function(callback) {
            // Get Connection
            storage.startTransaction(socket.gameId, callback);
        } ], function(err, res) {
            if (err) {
                resp.data = err;
                log.event(socket.logId, resp, data);
                fn(resp);
                return;
            }
            // Pass to next set
            // of tasks
            var conn = res[0];
            async.series([

            function(callback) {
                // Validate
                // GameState
                stateValidators.stateChecker(data, socket.gameId, socket.playerId, callback, conn);
            }, function(callback) {
                // Execute
                // event
                // Handler
                eventHandlers.eventHandler(data, socket.gameId, socket.playerId, callback, conn);
            } ], function(error, res) {
                if (error) {
                    storage.rollbackAndClose(conn);
                    resp.data = error;
                    log.event(socket.logId, resp, data);
                    fn(resp);
                } else {
                    storage.commitAndClose(conn);
                    resp.code = 'gameState';
                    resp.data = res;
                    log.event(socket.logId, resp, data);
                    io.to(socket.gameId).emit('gameState', res);
                }
            });
        });

    });

    /**
     * A player needs to authenticate their socket with our backend before we want them to do
     * anything.
     * 
     * They do this by giving us their playerId and some to-be-determined session value. This
     * persists as long as the socket is open.
     */
    socket.on('authenticate', function(data, fn) {
        var resp = util.format('error', '');
        data = util.tryParseJson(data);
        if ('gD' in data) {
            resp.data = 'INVALID_JSON';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        if (socket.auth) {
            resp.data = 'ALREADY_AUTHED';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        socket.logEventId = log.startEvent('authenticate', socket.logId);
        if (!('playerId' in data) || !('auth' in data)) {
            resp.data = 'INVALID_AUTH_PARAMS';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        playerData.auth(data.playerId, data.auth, function(status, authResp) {
            socket.auth = status;
            if (status) {
                socket.playerId = data.playerId;
            }
            resp.code = 'authStatus';
            resp.data = true;
            log.event(socket.logId, resp, data);
            fn(resp);
        });
    });

    /**
     * Each Socket is good for only 1 game. So you must set the game your socket is for before you
     * can issue any other commands, except authenticate, which is required to join a game. '
     */
    socket.on('setGame', function(data, fn) {
        var resp = util.format('error', '');
        data = util.tryParseJson(data);
        if ('gD' in data) {
            resp.data = 'INVALID_JSON';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        socket.logEventId = log.startEvent('setGame', socket.logId);
        if (!socket.auth) {
            resp.data = 'NO_AUTH';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        if (!('gameId' in data)) {
            resp.data = 'INVALID_JOIN_PARAMS';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        if (isNaN(parseInt(data.gameId, 10))) {
            resp.data = 'INVALID_GAME_ID';
            log.event(socket.logId, resp, data);
            fn(resp);
            return;
        }
        data.gameId = +data.gameId;
        /**
         * 1. Get a connection 2. Execute all the validators 3. Close connection 4. Check if
         * validators returned true
         */
        async.series([ function(callback) {
            // Get Connection

            storage.startTransaction(null, callback);
        } ], function(err, res) {
            if (err) {
                console.log('Failed to Get Transaction/Connection');
                resp.data = err;
                log.event(socket.logId, resp, data);
                fn(resp);
                return;
            }
            // Pass to next set of tasks
            var conn = res[0];
            async.parallel({
                exists : function(callback) {
                    // Validate GameState
                    stateValidators.gameExists(data.gameId, conn, callback);
                },
                playerInGame : function(callback) {
                    // Execute event Handler
                    stateValidators.playerInGame(data.gameId, socket.playerId, conn, callback);
                }
            }, function(error, res) {
                storage.commitAndClose(conn);
                if (error) {
                    console.log('Failed to check validators');
                    resp.data = error;
                    log.event(socket.logId, resp, data);
                    fn(resp);
                    return;
                }
                if (!res.exists) {
                    resp.data = 'GAME_NOT_EXIST';
                    log.event(socket.logId, resp, data);
                    fn(resp);
                    return;
                }
                if (!res.playerInGame) {
                    resp.data = 'PLAYER_NOT_IN_GAME';
                    log.event(socket.logId, resp, data);
                    fn(resp);
                    return;
                }
               
                eventHandlers.fullStateUpdate(storage, data.gameId, function(errData, gameStateData) {
                    if (errData)    {
                        resp.data = errData;
                        log.event(socket.logId, resp, data);
                        fn(resp);
                        return;
                    }
                    
                    resp.code = 'gameState';
                    resp.data = gameStateData;
                    
                    fn(resp);

                    log.event(socket.logId, resp, data);
                    
                    socket.gameId = data.gameId;
                    socket.join(data.gameId);
                    
                });
            });
        });
    });

});

console.log('Ready');