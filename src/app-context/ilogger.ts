export interface ILogger {
    debug(msg: string, ...args: any[]): void;
    info(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
    fatal(msg: string, ...args: any[]): void;
}
