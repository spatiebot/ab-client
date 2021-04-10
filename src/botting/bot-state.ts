import { KEY_CODES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { StopWatch } from "../helpers/stopwatch";
import { IPos } from "../models/ipos";
import { IFindPathConfig } from "./ifindpath-config";
import { IKeyInstruction } from "./key-instruction";

const PATHFINDING_TIMEOUT = 2000; // ms
const PATHFINDING_STALE = 200; // ms

export class BotState {
    playerToKill: number;
    turningTimeout: any;
    boostTimeout: any;
    path: IPos[];
    autoPilotToFlag: boolean;
    autoFire: boolean;
    autoBoost: boolean;

    pathFindingWorker: Worker;
    calculatingPathStopwatch: StopWatch;
    public static createPathFindingWorker: () => Worker;

    private keyQueue: IKeyInstruction[] = [];
    private isWorkerInitializing = false;

    constructor(private context: IContext) {
        this.initPathFindingWorker();
    }

    initPathFindingWorker() {
        if (!this.isWorkerInitializing && this.calculatingPathStopwatch && this.calculatingPathStopwatch.elapsedMs > PATHFINDING_TIMEOUT) {
            // error in worker probably
            this.context.logger.warn("Recycling pathfindingworker after " + this.calculatingPathStopwatch.elapsedMs + " ms");
            this.pathFindingWorker.terminate();
            this.pathFindingWorker = null;
            this.calculatingPathStopwatch = null;
        }

        if (!this.pathFindingWorker) {
            this.isWorkerInitializing = true;
            this.pathFindingWorker = BotState.createPathFindingWorker();
            this.pathFindingWorker.onmessage = e => {
                if (e.data === "ready") {
                    this.isWorkerInitializing = false;
                    return;
                }
                const calculatedPath = JSON.parse(e.data);

                if (this.calculatingPathStopwatch.elapsedMs < PATHFINDING_STALE) {
                    this.path = calculatedPath.path;
                }

                this.calculatingPathStopwatch = null;
            };
        }

    }

    get isCalculatingPath(): boolean {
        return !!this.calculatingPathStopwatch;
    }

    calcPath(config: IFindPathConfig) {
        this.pathFindingWorker.postMessage(JSON.stringify(config));
        this.calculatingPathStopwatch = new StopWatch();
    }

    stop() {
        this.path = null;
        this.playerToKill = null;
        this.autoPilotToFlag = false;
        this.autoFire = false;
        this.autoBoost = false;
    }

    isOn(): boolean {
        return !!this.path || !!this.playerToKill || !!this.autoPilotToFlag || !!this.autoFire;
    }

    enqueueKey(key: KEY_CODES, state: boolean, duration = 0) {
        this.keyQueue.push({ key, state, duration });
    }

    eatKeyQueue(): IKeyInstruction[] {
        const result = this.keyQueue;
        this.keyQueue = [];
        return result;
    }

    requestTimeoutFor(instr: IKeyInstruction) {
        switch (instr.key) {
            case KEY_CODES.SPECIAL:
                if (this.boostTimeout) {
                    return null;
                }
                this.boostTimeout = setTimeout(() => {
                    this.context.connection.sendKey(instr.key, !instr.state);
                    this.context.botstate.boostTimeout = null;
                }, instr.duration);

                return this.boostTimeout;
            default:
                if (this.turningTimeout) {
                    return null;
                }
                this.turningTimeout = setTimeout(() => {
                    this.context.connection.sendKey(instr.key, !instr.state);
                    this.context.botstate.turningTimeout = null;
                }, instr.duration);

                return this.turningTimeout;
        }
    }

}