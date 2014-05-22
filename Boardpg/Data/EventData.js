require('./State.js');
var eventData = {
	"noEvent" : {
		"socketParams" : [

		],

		"requiresActive" : true,
		"validStates" : [

		],

		"stateChecker" : "",
		"handler" : ""
	},

	"createGame" : {
		"socketParams" : [ "gameId" ],

		"requiresActive" : false,
		"validStates" : [

		],

		"stateChecker" : "canCreateGame",
		"handler" : "createGame"
	},

	"rollDice" : {
		"socketParams" : [

		],

		"requiresActive" : true,
		"validStates" : [ GLOBAL.state.BOARD ],

		"stateChecker" : "genericValidator",
		"handler" : "rollDice"
	}
};