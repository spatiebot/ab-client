import { IPos } from "../models/ipos";
import { highresAircraftMaps, lowresAircraftMaps } from "./maprepresentation";
import { simplifyPath } from "./simplify-path";

const PATH_LENGTH_THRESHOLD_FOR_HIGHRES = 2000;

interface ICalculatedPath {
    isHighres: boolean;
    path: IPos[];
}

export class PathFinding {

    public static findPath(pos1: IPos, pos2: IPos, aircraftType: number): ICalculatedPath {

        const map = lowresAircraftMaps[aircraftType];
        let isHighres = false;
        let path = map.findPath(pos1, pos2);

        // switch to highres if possible
        if (path.length * map.getScale() < PATH_LENGTH_THRESHOLD_FOR_HIGHRES) {
            path = highresAircraftMaps[aircraftType].findPath(pos1, pos2);
            isHighres = true;
        }

        path = simplifyPath(path, map.getScale());

        return {
            isHighres,
            path
        }
    }
}

