import { ILogger } from "../app-context/ilogger";

export class BrowserLogger implements ILogger {
    public debug(msg: string, ...args: any[]): void {
        if ((window as any).debug) {
            this.log(msg, ...args);
        }
    }
    public info(msg: string, ...args: any[]): void {
        this.log(msg, ...args);
    }
    public warn(msg: string, ...args: any[]): void {
        this.log(msg, ...args);
    }
    public error(msg: string, ...args: any[]): void {
        this.log(msg, ...args);
    }
    public fatal(msg: string, ...args: any[]): void {
        this.log(msg, ...args);
    }
    public log(msg: string, ...args: any[]) {
        // tslint:disable-next-line: no-console
        console.log(msg, ...args);
    }

}
