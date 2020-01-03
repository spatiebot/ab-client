import { CHAT_TYPE } from "../../ab-assets/chat-constants";
import { SERVER_ERRORS, SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { Error, ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerAnnouncementRenderHandler implements IMessageHandler {

    public handles = [Events.SERVER_ANNOUNCEMENT, Events.SERVER_ERROR];

    constructor(private context: BrowserContext) {

    }

    public exec(ev: EventMessage): void {
        let msg: ServerMessage;
        if (ev.type === Events.SERVER_ANNOUNCEMENT) {
            msg = ev.args as ServerMessage;
        } else {
            const error = ev.args as Error;
            msg = { type: SERVER_MESSAGE_TYPES.ALERT, duration: 4000 } as ServerMessage;

            switch (error.error) {
                case SERVER_ERRORS.ACCOUNT_BANNED:
                    msg.text = "Account is banned";
                    break;
                case SERVER_ERRORS.AFK_DISCONNECT:
                    msg.text = "Disconnected, away too long.";
                    break;
                case SERVER_ERRORS.ALREADY_LOGGED_IN:
                    msg.text = "You are already logged in.";
                    break;
                case SERVER_ERRORS.CHAT_SPAMMING:
                    msg.text = "Don't spam!";
                    break;
                case SERVER_ERRORS.FLAG_CHANGE_TOO_FAST:
                    msg.text = "Wait before changing your flag.";
                    break;
                case SERVER_ERRORS.FORBIDDEN_TO_CHANGE_PLANE_IN_BTR:
                    msg.text = "Can't change aircraft in BTR.";
                    break;
                case SERVER_ERRORS.GLOBAL_BAN:
                    msg.text = "You have been banned.";
                    break;
                case SERVER_ERRORS.INCORRECT_PROTOCOL:
                    msg.text = "Your client uses an incorrect protocol version.";
                    break;
                case SERVER_ERRORS.INVALID_LOGIN_DATA:
                    msg.text = "Invalid login data.";
                    break;
                case SERVER_ERRORS.NOT_ENOUGH_UPGRADES:
                    msg.text = "Not enough upgrades";
                    break;
                case SERVER_ERRORS.PACKET_FLOODING_BAN:
                    msg.text = "Banned for packet flooding.";
                    break;
                case SERVER_ERRORS.PACKET_FLOODING_DISCONNECT:
                    msg.text = "Disconnected for packet flooding.";
                    break;
                case SERVER_ERRORS.PLAYER_KICKED:
                    msg.text = "You have been kicked.";
                    break;
                case SERVER_ERRORS.REQUIRED_INACTIVITY_AND_HEALTH_TO_RESPAWN:
                    msg.text = "Two seconds of inactivity and full health required to respawn.";
                    break;
                case SERVER_ERRORS.REQUIRED_INACTIVITY_AND_HEALTH_TO_SPECTATE:
                    msg.text = "Tow seconds of inactivity and full health required to spectate.";
                    break;
                case SERVER_ERRORS.UNKNOWN_COMMAND:
                    msg.text = "Unknown command";
                    break;
                case SERVER_ERRORS.UNKNOWN_ERROR:
                    msg.text = "Unknown error";
                    break;

            }
        }

        this.context.renderer.showServerMessage(msg.type, msg.duration, msg.text);

        // also show server messages in the chat.
        const div = document.createElement("div");
        div.innerHTML = msg.text;
        msg.text = div.innerText; // remove html elements
        this.context.renderer.addChat(null, "Server", CHAT_TYPE.CHAT, msg.text, null);
    }
}
