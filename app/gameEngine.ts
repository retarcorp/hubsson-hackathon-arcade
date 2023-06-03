import { Dir } from "fs";
import { Coordinate } from "libs/model";
import { Direction, GameState, PlayerCoordinates } from "libs/model";
import { config } from "./config";
import GameUtil from "./util";

export function getNextMove(gameState: GameState) {
    // return anyFreeNearbyStrategy(gameState)
    return longestRayStrategy(gameState);
}

type GameResponse = { direction: Direction, iteration: number };

const getField = (gameState: GameState) => {
    const field = new Array(gameState.width).fill(0).map(() => new Array(gameState.height).fill(0))
    gameState.players.forEach((pc: PlayerCoordinates, index) => {
        pc.coordinates.forEach((coord) => {
            field[coord.x][coord.y] = (index + 1);
        })
    })
    return field;
}

const getMyCoordsHistory = (gameState: GameState): Coordinate[] => {
    const me = gameState.players.find((player: PlayerCoordinates) => player.playerId === config.id)
    return me.coordinates;
}

const getMyCoords = (gameState: GameState): Coordinate => {
    return getMyCoordsHistory(gameState).reverse()[0];
}

const isCellSteppable = (field, width, height, x, y) => {
    if (x < 0) return false;
    if (x >= width) return false;
    if (y < 0) return false;
    if (y >= height) return false;
    return field[x][y] === 0;
}

const getMoveDelta = (dir: Direction) => {
    return {
        [Direction.UP]: { x: 0, y: -1 },
        [Direction.DOWN]: { x: 0, y: 1 },
        [Direction.LEFT]: { x: -1, y: 0 },
        [Direction.RIGHT]: { x: 1, y: 0 }
    }[dir];
}

const getMoveResult = (x, y, dir: Direction) => {
    const delta = getMoveDelta(dir);
    return {
        x: x + delta.x,
        y: y + delta.y
    }
}

const anyFreeNearbyStrategy = (gameState: GameState): GameResponse => {
    const field = getField(gameState);
    const { width, height } = gameState;
    const myCoords = getMyCoords(gameState);

    const myPrevDir = getMyPreviousDirection(gameState);

    const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
        .filter(d => d !== myPrevDir)
        .sort(() => Math.random() - 0.5) as Direction[]

    for (let dir of directions) {
        const moveResultCoords = getMoveResult(myCoords.x, myCoords.y, dir)
        if (isCellSteppable(field, width, height, moveResultCoords.x, moveResultCoords.y)) {
            return {
                direction: dir,
                iteration: gameState.iteration
            }
        }

    }

    return null;
}

const randomMoveStrategy = (gameState: GameState): GameResponse => {

    const myPrevDir = getMyPreviousDirection(gameState);

    const direction = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
        .filter(d => d !== myPrevDir)
        .sort(() => Math.random() - 0.5)[0]
    return { direction, iteration: gameState.iteration };
}


const getRayLength = (field, width: number, height: number, x: number, y: number, dir: Direction): number => {
    let length = 0;
    let move = {x, y};
    do {
        move = getMoveResult(move.x, move.y, dir);
        const canStep: boolean = isCellSteppable(field, width, height, move.x, move.y)
        if (canStep) {
            length += 1;
        } else {
            return length;
        }
    } while (true);
}

const getMyPreviousDirection = (gameState): Direction => {
    const history = getMyCoordsHistory(gameState)
    return null;
}


const longestRayStrategy = (gameState: GameState): GameResponse => {
    
    const util = new GameUtil(gameState);
    
    const field = util.getField();
    const { width, height } = gameState;
    const myCoords = util.getMyCoords();
    const myPrevDir = util.getMyPreviousDirection();
  


    const [x, y] = [myCoords.x, myCoords.y];

    const directions = util.getAvailableDirections();
    console.log(myPrevDir, directions);

    const rayLenghts = directions.map((dir) => ({dir, length: getRayLength(field, width, height, x, y, dir)}));
    rayLenghts.sort((a, b) => b.length - a.length);
    const dir = rayLenghts[0].dir;

    return {
        direction: dir,
        iteration: gameState.iteration
    }

}