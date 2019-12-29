import Cookies from "js-cookie";
import { FLAGS_CODE_TO_ISO } from "../ab-protocol/src/lib";
import { PlayerFlag } from "../ab-protocol/src/types/packets-server";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";

export class FlagCookieHandler implements IMessageHandler {

    public handles = [Events.PLAYER_CHANGE_FLAG];

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerFlag;
        const flag = FLAGS_CODE_TO_ISO["" + msg.flag];
        Cookies.set("flag", flag, { expires: 365 });
    }
}
