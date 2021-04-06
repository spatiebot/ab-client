import * as pathfinding from "node-pathfinding";
import { MAP_SIZE } from "../../ab-assets/map-constants";
import { abWalls } from "../../ab-assets/walls";
import { IContext } from "../../app-context/icontext";
import { IPos } from "../../models/ipos";

const mapRepresentation: number[][] = [[]];
const mapRepresentationScale = 10;

for (let y = 0; y < MAP_SIZE.HEIGHT / mapRepresentationScale; y++) {
    mapRepresentation[y] = [];
    for (let x = 0; x < MAP_SIZE.WIDTH / mapRepresentationScale; x++) {
        mapRepresentation[y][x] = 0;
    }
}

function translateToInternalRepresentation(pos: IPos): IPos {
    return {
        x: Math.round((pos.x + MAP_SIZE.HALF_WIDTH) / mapRepresentationScale),
        y: Math.round((pos.y + MAP_SIZE.HALF_HEIGHT) / mapRepresentationScale),
    };
}

function translateBack(internalPos: IPos): IPos {
    return {
        x: internalPos.x * mapRepresentationScale - MAP_SIZE.HALF_WIDTH,
        y: internalPos.y * mapRepresentationScale - MAP_SIZE.HALF_HEIGHT
    };
}

for (const wall of abWalls) {
    const pos = translateToInternalRepresentation({ x: wall[0], y: wall[1] });
    const radius = Math.round(wall[2] / mapRepresentationScale);

    for (let x = pos.x - radius; x < pos.x + radius; x++) {
        const dx = pos.x - x;
        for (let y = pos.y - radius; y < pos.y + radius; y++) {
            const dy = pos.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= radius) {
                mapRepresentation[y][x] = 1;
            }
        }
    }
}

const width = mapRepresentation[0].length;
const height = mapRepresentation.length;

const buf = pathfinding.bytesFrom2DArray(width, height, mapRepresentation);
const grid = pathfinding.buildGrid(width, height, buf);

/* tslint:disable:no-bitwise */
function posFrom32bits(bits: number): IPos {
    return { x: bits >>> 16, y: bits & 0xFFF };
}
/* tslint:enable:no-bitwise */

export class PathFinding {

    constructor(private context: IContext) {

    }

    public findPath(pos1: IPos, pos2: IPos): IPos[] {
        const tpos1 = translateToInternalRepresentation(pos1);
        const tpos2 = translateToInternalRepresentation(pos2);

        const path = pathfinding.findPath(tpos1.x, tpos1.y, tpos2.x, tpos2.y, grid);

        const result: IPos[] = [];
        for (const bit of path) {
            result.push(translateBack(posFrom32bits(bit)));
        }

        return result;
    }

}

