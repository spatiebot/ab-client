export class TimerManager {
    private timeouts = [];
    private intervals = [];

    setTimeout(action: () => void, ms) {
        const id = setTimeout(() => {
            this.onTimeoutFinished(id);
            action();
        }, ms);
        this.timeouts.push(id);
        return id;
    }

    setInterval(action: () => void, ms) {
        const id = setInterval(() => action(), ms);
        this.intervals.push(id);
        return id;
    }

    clearTimeout(id): void {
        clearTimeout(id);
        this.onTimeoutFinished(id);
    }

    clearInterval(id): void {
        clearInterval(id);
        this.onIntervalCleared(id);
    }

    private onTimeoutFinished(id) {
        this.timeouts = this.timeouts.filter(x => x !== id);
    }

    private onIntervalCleared(id) {
        this.intervals = this.intervals.filter(x=>x !== id);
    }

    clearAll() {
        for (let i = 0; i < this.timeouts.length; i++) {
            clearTimeout(this.timeouts[i]);
        }
        for (let i = 0; i < this.intervals.length; i++) {
            clearInterval(this.intervals[i]);
        }

        this.timeouts = [];
        this.intervals = [];
    }
}