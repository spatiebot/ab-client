import { IFindPathConfig } from "./botting/ifindpath-config";
import { PathFinding } from "./botting/path-finding";

declare function postMessage(x: any): any;

PathFinding.initialize();

postMessage("ready");

onmessage = e => {
    try {
        const config = JSON.parse(e.data) as IFindPathConfig;
        const path = PathFinding.findPath(config);

        postMessage(JSON.stringify(path));
    } catch (error) {
        // tslint:disable-next-line: no-console
        console.log("error in worker", error);
    }
};
