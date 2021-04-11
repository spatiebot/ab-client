import { PLAYERS_POSITION } from "../ab-assets/map-constants";
import { IPos } from "../models/ipos";
import { IFindPathConfig } from "./ifindpath-config";
import { IShipAwareMapRepresentation } from "./ishipaware-maprepresentation";
import { highresAircraftMaps, lowestresMaps, lowresAircraftMaps } from "./maprepresentation";

const PATH_LENGTH_THRESHOLD_FOR_HIGHRES = 2000;
const PATH_LENGTH_THRESHOLD_FOR_LOWRES = 80000;

interface ICalculatedPath {
    isHighres: boolean;
    path: IPos[];
}

export class PathFinding {

    public static initialize() {
        // touch one of the maps to trigger initialize
        const map = lowresAircraftMaps[2];
        map.getScale();
    }

    public static findPath(config: IFindPathConfig): ICalculatedPath {
        const pos1 = config.pos1;
        const pos2 = config.pos2;
        const aircraftType = config.aircraftType;
        const pointsToAvoid = config.pointsToAvoid;

        // if window is minimized, player position is unknown
        if (Math.abs(pos1.x) === PLAYERS_POSITION.MAX_X || Math.abs(pos2.x) === PLAYERS_POSITION.MAX_X) {
            return {
                isHighres: false,
                path: null
            };
        }

        // tslint:disable-next-line: no-console
        // console.log("pos: ", pos1.x, pos1.y, " other: ", pos2.x, pos2.y);

        let isHighres = false;

        let map = lowestresMaps[aircraftType]
        let path = PathFinding.tryFindPath(map, pos1, pos2, []);
        if (!path || path.length * map.getScale() < PATH_LENGTH_THRESHOLD_FOR_LOWRES) {
            map = lowresAircraftMaps[aircraftType];
            path = PathFinding.tryFindPath(map, pos1, pos2, []);
        }

        // switch to highres if possible
        if (!path || path.length * map.getScale() < PATH_LENGTH_THRESHOLD_FOR_HIGHRES) {
            map = highresAircraftMaps[aircraftType];
            path = PathFinding.tryFindPath(map, pos1, pos2, pointsToAvoid);
            isHighres = true;
        } else {
            // otherwise calc the first segments as highres
            const segmentLength = Math.round((PATH_LENGTH_THRESHOLD_FOR_HIGHRES / 2) / map.getScale());
            if (path.length >= segmentLength) {
                const refinedPath = this.tryFindPath(highresAircraftMaps[aircraftType], path[0], path[segmentLength - 1], pointsToAvoid);
                if (refinedPath) {
                    refinedPath.push(...path.slice(segmentLength));
                    path = refinedPath;
                }
            }
        }

        return {
            isHighres,
            path
        }
    }

    private static tryFindPath(map: IShipAwareMapRepresentation, pos1: IPos, pos2: IPos, pointsToAvoid: IPos[]) {
        try {
            return map.findPath(pos1, pos2, pointsToAvoid);
        } catch (error) {
            // tslint:disable-next-line: no-console
            console.log("error finding path", error);
            // tslint:disable-next-line: no-console
            console.log("pos: ", pos1.x, pos1.y, " other: ", pos2.x, pos2.y);
        }
    }
}

