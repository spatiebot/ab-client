import { ILogger } from "../app-context/ilogger";

export class BrowserLogger implements ILogger {
    debug(msg: string, ...args: any[]): void {
        this.log(msg, args);
    }
    info(msg: string, ...args: any[]): void {
        this.log(msg, args);
    }
    warn(msg: string, ...args: any[]): void {
        this.log(msg, args);
    }
    error(msg: string, ...args: any[]): void {
        this.log(msg, args);
    }
    fatal(msg: string, ...args: any[]): void {
        this.log(msg, args);
    }
    log(msg: string, args: any[]) {
        console.log(msg, args);
    }

}