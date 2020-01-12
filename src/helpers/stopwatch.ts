export class StopWatch {
    private startTime: number;

    constructor(private timeoutMs: number = null) {
        this.start();
    }

    public start(): void {
        this.startTime = performance.now();
    }

    get elapsedMs(): number {
        return performance.now() - this.startTime;
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
