// from: https://gist.github.com/adammiller/826148

import { IPos } from "../models/ipos";

class Line {

    constructor(private p1: IPos, private p2: IPos) {
    }

    public distanceToPoint(point: IPos) {
        // slope
        const m = (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
        // y offset
        const b = this.p1.y - (m * this.p1.x);
        const d = [];
        // distance to the linear equation
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        // distance to p1
        d.push(Math.sqrt(Math.pow((point.x - this.p1.x), 2) + Math.pow((point.y - this.p1.y), 2)));
        // distance to p2
        d.push(Math.sqrt(Math.pow((point.x - this.p2.x), 2) + Math.pow((point.y - this.p2.y), 2)));
        // return the smallest distance
        return d.sort((first, second) => first - second)[0]; // causes an array to be sorted numerically and ascending
    }
}

function douglasPeucker(points: IPos[], distanceTolerance: number): IPos[] {
    if (points.length <= 2) {
        return [points[0]];
    }
    let returnPoints: IPos[] = [];
    // make line from start to end
    const line = new Line(points[0], points[points.length - 1]);
    // find the largest distance from intermediate poitns to this line
    let maxDistance = 0;
    let maxDistanceIndex = 0;
    for (let i = 1; i <= points.length - 2; i++) {
        const distance = line.distanceToPoint(points[i]);
        if (distance > maxDistance) {
            maxDistance = distance;
            maxDistanceIndex = i;
        }
    }
    // check if the max distance is greater than our tollerance allows
    if (maxDistance >= distanceTolerance) {
        const p = points[maxDistanceIndex];
        line.distanceToPoint(p);
        // include this point in the output
        returnPoints = returnPoints.concat(douglasPeucker(points.slice(0, maxDistanceIndex + 1), distanceTolerance));
        // returnPoints.push( points[maxDistanceIndex] );
        returnPoints = returnPoints.concat(douglasPeucker(points.slice(maxDistanceIndex, points.length), distanceTolerance));
    } else {
        // ditching this point
        const p = points[maxDistanceIndex];
        line.distanceToPoint(p);
        returnPoints = [points[0]];
    }
    return returnPoints;
}

function simplifyPath(points: IPos[], distanceTolerance: number): IPos[] {
    const arr = douglasPeucker(points, distanceTolerance);

    // always have to push the very last point on so it doesn't get left off
    arr.push(points[points.length - 1]);
    return arr;
}

export { simplifyPath }