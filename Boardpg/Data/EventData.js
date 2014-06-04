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

	"createGame" : {
		"socketParams" : [],

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