import { IWebSocketFactory } from "../app-context/iwebsocket-factory";

export class BrowserWebSocketFactory implements IWebSocketFactory {
    public create(url: string): WebSocket {
        return new WebSocket(url);
    }
}
