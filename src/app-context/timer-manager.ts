export class TimerManager {
    private timeouts = [];
    private intervals = [];

    public setTimeout(action: () => void, ms) {
        const id = setTimeout(() => {
            this.onTimeoutFinished(id);
            action();
        }, ms);
        this.timeouts.push(id);
        return id;
    }

    public setInterval(action: () => void, ms) {
        const id = setInterval(() => action(), ms);
        this.intervals.push(id);
        return id;
    }

    public clearTimeout(id): void {
        clearTimeout(id);
        this.onTimeoutFinished(id);
    }

    public clearInterval(id): void {
        clearInterval(id);
        this.onIntervalCleared(id);
    }

    public clearAll() {
        for (const t of this.timeouts) {
            clearTimeout(t);
        }
        for (const i of this.intervals) {
            clearInterval(i);
        }

        this.timeouts = [];
        this.intervals = [];
    }

    private onTimeoutFinished(id) {
        this.timeouts = this.timeouts.filter((x) => x !== id);
    }

    private onIntervalCleared(id) {
        this.intervals = this.intervals.filter((x) => x !== id);
    }
}
