export class StopWatch {
    private startTime: number;

    constructor() {
        this.start();
    }

    public start(): void {
        this.startTime = Date.now();
    }

    get elapsedMs(): number {
        return Date.now() - this.startTime;
    }

    get elapsedSeconds(): number {
        return this.elapsedMs / 1000;
    }

    get elapsedMinutes(): number {
        return this.elapsedSeconds / 60;
    }
}
