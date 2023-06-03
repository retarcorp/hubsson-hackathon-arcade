import { Direction, GameState } from "libs/model";
import GameUtil from "./util";

export function getNextMove(gameState: GameState) {
    const readonlyState = Object.freeze(gameState);

    const isMutated = Math.random() > 1;

    if (isMutated) {
        return anyFreeNearbyStrategy(readonlyState);
    }

    return largestAvailableAreaStrategy(readonlyState);
}

type GameResponse = { direction: Direction, iteration: number };

const anyFreeNearbyStrategy = (gameState: GameState): GameResponse => {
    const util = new GameUtil(gameState);
    const myCoords = util.getMyCoords();

    const directions = util.getAvailableDirections()
        .sort(() => Math.random() - 0.5) as Direction[]

    for (let dir of directions) {
        const moveResultCoords = util.getMoveResult(myCoords.x, myCoords.y, dir)
        if (util.isCellSteppable(moveResultCoords.x, moveResultCoords.y)) {
            return {
                direction: dir,
                iteration: gameState.iteration
            }
        }

    }

    return null;
}

const randomMoveStrategy = (gameState: GameState): GameResponse => {

    const util = new GameUtil(gameState);

    const direction = util.getAvailableDirections()
        .sort(() => Math.random() - 0.5)[0]

    return { direction, iteration: gameState.iteration };
}


const longestRayStrategy = (gameState: GameState): GameResponse => {

    const util = new GameUtil(gameState);
    const myCoords = util.getMyCoords();

    const [x, y] = [myCoords.x, myCoords.y];

    const directions = util.getAvailableDirections();

    const rayLenghts = directions.map((dir) => ({ dir, length: util.getRayLength(x, y, dir) }));
    rayLenghts.sort((a, b) => b.length - a.length);
    const dir = rayLenghts[0].dir;

    return {
        direction: dir,
        iteration: gameState.iteration
    }

}

const largestAvailableAreaStrategy = (gameState): GameResponse => {

    const util = new GameUtil(gameState);
    const directions = util.getAvailableDirections();
    const myCoords = util.getMyCoords();

    const waves = directions.map((dir) => {
        const newCoords = util.getMoveResult(myCoords.x, myCoords.y, dir);
        const size = util.getWaveAreaSize(newCoords.x, newCoords.y)
        return { dir, size }
    });

    const preferredDir = waves.sort((a, b) => b.size - a.size)[0].dir;

    if ((waves.reduce((sum, { size }) => sum + size, 0) / waves.length) === waves[0].size) {
        // Fallback to longest ray strategy in case if all moves give same free area size 
        return longestRayStrategy(gameState);
    }

    return {
        direction: preferredDir,
        iteration: gameState.iteration
    }

} 