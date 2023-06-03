import { GameState, Direction } from "../libs/model";
import { GameClient } from "../libs/game-client";

import { config } from "./config";
import { getNextMove } from "./gameEngine";


const gameClient = new GameClient(config);

gameClient.onGameStart((): void => {
	console.log("Game started!");
});

gameClient.onGameUpdate((gameState: GameState): void => {
	
	const action = getNextMove(gameState);
	gameClient.sendAction(action.direction, action.iteration);
});

gameClient.run();
