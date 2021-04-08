import * as pathfinding from "node-pathfinding";
import { MAP_SIZE } from "../ab-assets/map-constants";
import { SHIPS_SPECS, SHIPS_TYPES } from "../ab-assets/ships-constants";
import { abWalls } from "../ab-assets/walls";
import { IPos } from "../models/ipos";

const HIGH_RES = 10;
const LOW_RES = 100;

/* tslint:disable:no-bitwise */
function posFrom32bits(bits: number): IPos {
    return { x: bits >>> 16, y: bits & 0xFFF };
}
/* tslint:enable:no-bitwise */

class ShipAwareMapRepresentation {
    private map: number[][] = [[]];
    private grid: any;


    constructor(private scale: number, shipWidth: number) {

        for (let y = 0; y < MAP_SIZE.HEIGHT / scale; y++) {
            this.map[y] = [];
            for (let x = 0; x < MAP_SIZE.WIDTH / scale; x++) {
                this.map[y][x] = 0;
            }
        }
        for (let y = 0; y < MAP_SIZE.HEIGHT / scale; y++) {
            this.map[y] = [];
            for (let x = 0; x < MAP_SIZE.WIDTH / scale; x++) {
                this.map[y][x] = 0;
            }
        }

        for (const wall of abWalls) {
            const pos = this.translateToInternalRepresentation({ x: wall[0], y: wall[1] });

            // add shipwidth / 2 (or a bit more) to the radius to account for the width of the ship in relation to the walls
            const radius = Math.round((wall[2] + shipWidth) / scale);

            for (let x = pos.x - radius; x < pos.x + radius; x++) {
                const dx = pos.x - x;
                for (let y = pos.y - radius; y < pos.y + radius; y++) {
                    const dy = pos.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= radius) {
                        this.map[y][x] = 1;
                    }
                }
            }
        }

        const width = this.map[0].length;
        const height = this.map.length;

        const buf = pathfinding.bytesFrom2DArray(width, height, this.map);
        this.grid = pathfinding.buildGrid(width, height, buf);
    }

    private translateToInternalRepresentation(pos: IPos): IPos {
        return {
            x: Math.round((pos.x + MAP_SIZE.HALF_WIDTH) / this.scale),
            y: Math.round((pos.y + MAP_SIZE.HALF_HEIGHT) / this.scale),
        };
    }

    private translateBack(internalPos: IPos): IPos {
        return {
            x: internalPos.x * this.scale - MAP_SIZE.HALF_WIDTH,
            y: internalPos.y * this.scale - MAP_SIZE.HALF_HEIGHT
        };
    }

    public getScale(): number {
        return this.scale;
    }

    public findPath(pos1: IPos, pos2: IPos): IPos[] {
        const tpos1 = this.translateToInternalRepresentation(pos1);
        const tpos2 = this.translateToInternalRepresentation(pos2);

        const path = pathfinding.findPath(tpos1.x, tpos1.y, tpos2.x, tpos2.y, this.grid);

        const result: IPos[] = [];
        for (const bit of path) {
            result.push(this.translateBack(posFrom32bits(bit)));
        }

        return result;
    }
}

const lowresAircraftMaps: ShipAwareMapRepresentation[] = [];
const highresAircraftMaps: ShipAwareMapRepresentation[] = [];

for (const shipType of [SHIPS_TYPES.PREDATOR, SHIPS_TYPES.GOLIATH, SHIPS_TYPES.COPTER, SHIPS_TYPES.TORNADO, SHIPS_TYPES.PROWLER]) {
    const hitCircles = SHIPS_SPECS[shipType].collisions;

    let leftX: number = 999;
    let rightX: number = 0;
    for (const circle of hitCircles) {
        const x = circle[0];
        const y = circle[1];
        const r = circle[2];
        if (x - r < leftX) {
            leftX = x - r;
        }
        if (x + r > rightX) {
            rightX = x + r;
        }
    }
    const shipWidth = rightX - leftX;

    lowresAircraftMaps[shipType] = new ShipAwareMapRepresentation(LOW_RES, shipWidth);
    highresAircraftMaps[shipType] = new ShipAwareMapRepresentation(HIGH_RES, shipWidth);
}

export { lowresAircraftMaps, highresAircraftMaps }