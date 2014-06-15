require('./State.js');
var eventData = {
    "noEvent" : {
        "socketParams" : [

        ],

        "requiresActive" : true,
        "validStates" : [ GLOBAL.state.NO_STATE ],

        "stateChecker" : "",
        "handler" : ""
    },
    
    "continueDead" :    {
        "socketParams" : [],

        "requiresActive" : true,
        "validStates" : [
             GLOBAL.state.DEAD
        ],

        "stateChecker" : "nullValidator",
        "handler" : "continueDead"
    },

    "createGame" : {
        "socketParams" : [],

        "requiresActive" : false,
        "validStates" : [

        ],

        "stateChecker" : "canCreateGame",
        "handler" : "createGame"
    },

    "rollDice" : {
        "socketParams" : [],

        "requiresActive" : true,
        "validStates" : [ GLOBAL.state.BOARD ],

        "stateChecker" : "nullValidator",
        "handler" : "rollDice"
    }
};

module.exports = eventData;