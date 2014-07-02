var state = {};

state.NO_STATE = -2;
state.GAME_OVER = -1;
state.WAIT_FOR_PLAYERS = 0;
state.BOARD = 1;
state.MOVING = 2;
state.ROULETTE = 3;
state.NPC = 4;
state.COMBAT = 8;

state.DEAD = 11;
state.END_TURN = 12;

GLOBAL.state = state;
