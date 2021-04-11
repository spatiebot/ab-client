import * as pathfinding from "node-pathfinding";
import { MAP_SIZE } from "../ab-assets/map-constants";
import { SHIPS_SPECS, SHIPS_TYPES } from "../ab-assets/ships-constants";
import { abWalls } from "../ab-assets/walls";
import { IPos } from "../models/ipos";
import { AircraftSize } from "./aircraft-size";
import { IShipAwareMapRepresentation } from "./ishipaware-maprepresentation";

const HIGH_RES = 10;
const LOW_RES = 100;
const LOWEST_RES = 500;

/* tslint:disable:no-bitwise */
function posFrom32bits(bits: number): IPos {
    return { x: bits >>> 16, y: bits & 0xFFF };
}
/* tslint:enable:no-bitwise */

class ShipAwareMapRepresentation implements IShipAwareMapRepresentation {
    private grid: any;

    constructor(private scale: number, shipWidth: number) {

        const mapArray: number[][] = [[]];

        for (let y = 0; y < MAP_SIZE.HEIGHT / scale; y++) {
            mapArray[y] = [];
            for (let x = 0; x < MAP_SIZE.WIDTH / scale; x++) {
                mapArray[y][x] = 0;
            }
        }
        for (let y = 0; y < MAP_SIZE.HEIGHT / scale; y++) {
            mapArray[y] = [];
            for (let x = 0; x < MAP_SIZE.WIDTH / scale; x++) {
                mapArray[y][x] = 0;
            }
        }

        for (const wall of abWalls) {
            const pos = this.translateToInternalRepresentation({ x: wall[0], y: wall[1] });

            // add shipwidth / 2 (or a bit more) to the radius to account for the width of the ship in relation to the walls
            const radius = Math.round((wall[2] + shipWidth * 0.8) / scale);

            for (let x = pos.x - radius; x < pos.x + radius; x++) {
                const dx = pos.x - x;
                for (let y = pos.y - radius; y < pos.y + radius; y++) {
                    const dy = pos.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= radius) {
                        mapArray[y][x] = 1;
                    }
                }
            }
        }

        const width = mapArray[0].length;
        const height = mapArray.length;

        const buf = pathfinding.bytesFrom2DArray(width, height, mapArray);
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

    public findPath(pos1: IPos, pos2: IPos, pointsToAvoid: IPos[]): IPos[] {
        const tpos1 = this.translateToInternalRepresentation(pos1);
        const tpos2 = this.translateToInternalRepresentation(pos2);

        const restoreWalkability: IPos[] = [];
        for (const p of pointsToAvoid) {
            const mapPoint = this.translateToInternalRepresentation(p);
            for (let x = mapPoint.x - 1; x <= mapPoint.x + 1; x++) {
                for (let y = mapPoint.y - 1; y <= mapPoint.y + 1; y++) {
                    if (this.grid.isWalkableAt(x, y)) {
                        restoreWalkability.push({x, y});
                        this.grid.setWalkableAt(x, y, false);
                    }
                }
            }
        }

        const result: IPos[] = [];

        try {
            const path = pathfinding.findPath(tpos1.x, tpos1.y, tpos2.x, tpos2.y, this.grid);

            if (path) {
                for (const bit of path) {
                    result.push(this.translateBack(posFrom32bits(bit)));
                }
            }
        } finally {
            for (const p of restoreWalkability) {
                this.grid.setWalkableAt(p.x, p.y, true);
            }
        }

        return result;
    }
}

const lowresAircraftMaps: IShipAwareMapRepresentation[] = [];
const highresAircraftMaps: IShipAwareMapRepresentation[] = [];
const lowestresMaps: IShipAwareMapRepresentation[] = [];

const lowestresMap = new ShipAwareMapRepresentation(LOWEST_RES, AircraftSize.getSize(SHIPS_TYPES.GOLIATH).width);

for (const shipType of [SHIPS_TYPES.PREDATOR, SHIPS_TYPES.GOLIATH, SHIPS_TYPES.COPTER, SHIPS_TYPES.TORNADO, SHIPS_TYPES.PROWLER]) {
    lowresAircraftMaps[shipType] = new ShipAwareMapRepresentation(LOW_RES, AircraftSize.getSize(shipType).width);
    highresAircraftMaps[shipType] = new ShipAwareMapRepresentation(HIGH_RES, AircraftSize.getSize(shipType).width);
    lowestresMaps[shipType] = lowestresMap;
}

export { lowestresMaps, lowresAircraftMaps, highresAircraftMaps }