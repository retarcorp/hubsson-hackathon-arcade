import { Direction, GameState, PlayerCoordinates } from "libs/model";
import { config } from "./config";

export default class GameUtil {
    gameState: GameState;

    constructor(gameState) {
        this.gameState = gameState;
    }

    getField() {
        const field = new Array(this.gameState.width).fill(0).map(() => new Array(this.gameState.height).fill(0))
        this.gameState.players.forEach((pc: PlayerCoordinates, index) => {
            pc.coordinates.forEach((coord) => {
                field[coord.x][coord.y] = (index + 1);
            })
        })
        return field;
    }

    getMoveDelta(dir: Direction) {
        return {
            [Direction.UP]: { x: 0, y: -1 },
            [Direction.DOWN]: { x: 0, y: 1 },
            [Direction.LEFT]: { x: -1, y: 0 },
            [Direction.RIGHT]: { x: 1, y: 0 }
        }[dir];
    }

    getMoveResult(x, y, dir: Direction) {
        const delta = this.getMoveDelta(dir);
        return {
            x: x + delta.x,
            y: y + delta.y
        }
    }

    isCellSteppable(x, y) {
        const { width, height } = this.gameState;
        const field = this.getField();

        if (x < 0) return false;
        if (x >= width) return false;
        if (y < 0) return false;
        if (y >= height) return false;
        return field[x][y] === 0;
    }

    getMyCoordsHistory() {
        const me = this.gameState.players.find((player: PlayerCoordinates) => player.playerId === config.id)
        return me.coordinates;
    }

    getMyCoords() {
        return [...this.getMyCoordsHistory()].reverse()[0]
    }

    getMyPreviousDirection(): Direction {
        const history = this.getMyCoordsHistory()
        const currentPoint = this.getMyCoords();

        if (history.length < 2) {
            return null;
        }

        const prev = [...history].reverse()[1];
        const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT]
        const twoPointsEqual = (p1, p2) => (p1.x === p2.x) && (p1.y === p2.y)

        for (let dir of directions) {
            if (twoPointsEqual(currentPoint, this.getMoveResult(prev.x, prev.y, dir))) {
                return dir;
            }
        }
    }

    getOppositeDirection(dir: Direction): Direction {
        return {
            [Direction.UP]: Direction.DOWN,
            [Direction.DOWN]: Direction.UP,
            [Direction.LEFT]: Direction.RIGHT,
            [Direction.RIGHT]: Direction.LEFT
        }[dir]
    }

    getAvailableDirections(): Direction[] {

        const myPrevDir = this.getMyPreviousDirection();
        const notAllowedDir = this.getOppositeDirection(myPrevDir);
        return [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].filter((dir) => dir !== notAllowedDir);
    }

    getRayLength( x: number, y: number, dir: Direction) {
        let length = 0;
        let move = {x, y};
        do {
            move = this.getMoveResult(move.x, move.y, dir);
            const canStep: boolean = this.isCellSteppable(move.x, move.y)
            if (canStep) {
                length += 1;
            } else {
                return length;
            }
        } while (true);
    }

    getWaveAreaSize(x: number, y: number) {
        const field = this.getField();
        field[x][y] = Infinity;

        const stack = [];
        // Get all available cells for cells in a stack 
        // Remove previous cells in a stack
        // Put available to a stack
        // Mark cells in a field as null
        // areaSize += stack size
        // For each cell in a stack -> line 112
        // When stack is empty - finish

        return 0;
    }

    
}