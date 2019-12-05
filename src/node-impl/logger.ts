import pino from 'pino';
import { ILogger } from '../app-context/ilogger';
import { Settings } from '../app-context/settings';

export class Logger implements ILogger {
    private logger: pino.Logger;

    constructor(settings: Settings) {

        let config: any = {
            level: settings.logLevel,
            name: `1_${settings.playerName}`
        };

        if (settings.isDevelopment) {
            config = {
                ...config,
                prettyPrint: {
                    colorize: true,
                    translateTime: true,
                    ignore: 'pid,hostname'
                }
            };
        }

        this.logger = pino(config, pino.destination());
    }

    debug(msg: string, ...args: any[]): void {
        this.logger['debug'](msg, ...args);
    }

    info(msg: string, ...args: any[]): void {
        this.logger['info'](msg, ...args);
    }

    warn(msg: string, ...args: any[]): void {
        this.logger['warn'](msg, ...args);
    }

    error(msg: string, ...args: any[]): void {
        this.logger['error'](msg, ...args);
    }

    fatal(msg: string, ...args: any[]): void {
        this.logger['error'](msg, ...args);
    }
}
