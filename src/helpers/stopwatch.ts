export class StopWatch {

    // this is overwritten in the nodejs case
    public static performanceNow: () => number = () => performance.now();

    public startTime: number;
    public timeoutMs: number;

    constructor(other: {startTime: number, timeoutMs: number} = null) {
        if (other) {
            this.startTime = other.startTime;
            this.timeoutMs = other.timeoutMs;
        }
        this.start();
    }

    public start(): void {
        this.startTime = StopWatch.performanceNow();
    }

    get elapsedMs(): number {
        return StopWatch.performanceNow() - this.startTime;
    }

    get elapsedSeconds(): number {
        return this.elapsedMs / 1000;
    }

    get elapsedMinutes(): number {
        return this.elapsedSeconds / 60;
    }

    get hasTimedOut(): boolean {
        if (!this.timeoutMs) {
            return false;
        }
        return this.elapsedMs > this.timeoutMs;
    }

    get timeoutFraction(): number {
        if (!this.timeoutMs) {
            return 0;
        }
        return this.elapsedMs / this.timeoutMs;
    }
}
