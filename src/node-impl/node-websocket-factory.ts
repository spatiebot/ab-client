import WebSocket from "ws";
import { IWebSocketFactory } from "../app-context/iwebsocket-factory";

export class NodeWebSocketFactory implements IWebSocketFactory {

    public create(url: string): WebSocket {
        return new WebSocket(url);
    }
}
