import { SHIPS_SPECS, SHIPS_TYPES } from "../ab-assets/ships-constants";

const sizes: AircraftSize[] = [];

export class AircraftSize {

    constructor(private _width: number, private _height: number) {
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    static getSize(type: number): AircraftSize {
        return sizes[type];
    }
}

for (const shipType of [SHIPS_TYPES.PREDATOR, SHIPS_TYPES.GOLIATH, SHIPS_TYPES.COPTER, SHIPS_TYPES.TORNADO, SHIPS_TYPES.PROWLER]) {
    const hitCircles = SHIPS_SPECS[shipType].collisions;

    let leftX: number = 999;
    let rightX: number = 0;
    let topY: number = 999;
    let bottomY: number = 0;
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
        if (y - r < topY) {
            topY = y - r;
        }
        if (y + r > bottomY) {
            bottomY = y + r;
        }
    }
    const shipWidth = rightX - leftX;
    const shipHeight = bottomY - topY;
    const size = new AircraftSize(shipWidth, shipHeight);
    sizes[shipType] = size;
}

