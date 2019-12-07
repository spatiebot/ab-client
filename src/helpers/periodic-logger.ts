import { IContext } from "../app-context/icontext";
import { StopWatch } from "./stopwatch";

export class PeriodicLogger {

    private stopwatch = new StopWatch();

    constructor(private context: IContext, private intervalSeconds: number = 3) {
    }

    public log(msg: string, ...args: any[]) {
        if (this.stopwatch.elapsedSeconds < this.intervalSeconds) {
            return;
        }
        this.context.logger.info(msg, ...args);
        this.stopwatch.start();
    }
}
