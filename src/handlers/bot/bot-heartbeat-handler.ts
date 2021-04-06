import { KEY_CODES, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Rotation } from "../../helpers/rotation";
import { StopWatch } from "../../helpers/stopwatch";
import { PathFinding } from "../../node-impl/botting/path-finding";
import { NodeContext } from "../../node-impl/node-context";
import { IMessageHandler } from "../imessage-handler";

const BOT_TICK_MS = 100;

export class BotHeartbeatHandler implements IMessageHandler {

    public handles = [Events.TICK];

    private timer = new StopWatch(BOT_TICK_MS);

    constructor(private context: NodeContext) {
        this.timer.start();
    }

    public exec(ev: EventMessage): void {
        if (!this.timer.hasTimedOut) {
            return;
        }

        if (this.context.botstate.followId) {
            const playerToFollow = this.context.state.getPlayerById(this.context.botstate.followId);

            let left = false;
            let right = false;
            if (playerToFollow && playerToFollow.status === PLAYER_STATUS.ALIVE) {

                const pathFinding = new PathFinding(this.context);
                const me = this.context.state.getFocusedPlayer();
                const pathToPlayer = pathFinding.findPath(me.pos, playerToFollow.pos);
                if (pathToPlayer.length > 10) {
                    const nextStep = pathToPlayer[1];
                    const targetRotation = Rotation.getTargetRotation(me.pos, nextStep);
                    const rotDiff = Rotation.getAngleDiff(me.rot, targetRotation);

                    if (Math.abs(rotDiff) > 0.05) {
                        if (rotDiff > 0) {
                            right = true;
                        } else {
                            left = true;
                        }
                    }
                }
            }

            this.context.connection.sendKey(KEY_CODES.LEFT, left);
            this.context.connection.sendKey(KEY_CODES.RIGHT, right);
        }

        this.timer.start();
    }
}
