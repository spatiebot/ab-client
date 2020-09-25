import { PLAYERS_POSITION } from "../../ab-assets/map-constants";
import { SHIPS_SPECS } from "../../ab-assets/ships-constants";
import { UPGRADES_SPECS } from "../../ab-assets/upgrade-constants";
import { PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { ITickArgs } from "../../events/event-args/itick-args";
import { EventMessage } from "../../events/event-message";
import { PeriodicLogger } from "../../helpers/periodic-logger";
import { Player } from "../../models/player";
import { IMessageHandler } from "../imessage-handler";

export const PI_X2 = 2 * Math.PI;

export class PlayerMaintenanceHandler implements IMessageHandler {

    public handles = [Events.TICK];

    private logger = new PeriodicLogger(this.context);

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage): void {
        const tick = ev.args as ITickArgs;

        for (const player of this.context.writeState.getPlayers()) {

            if (player.status === PLAYER_STATUS.INACTIVE) {
                continue;
            }

            this.updatePlayer(player, tick);
        }
    }

    private updatePlayer(player: Player, tick: ITickArgs) {

        const aircraftSpecs = SHIPS_SPECS[player.type];

        const boostFactor = player.boost ? aircraftSpecs.boostFactor : 1;

        const frameFactor = tick.frameFactor;

        if (!isNaN(player.energyRegen)) {
            const energyDiff = player.energyRegen * frameFactor;

            player.energy += energyDiff;
            if (player.energy > 1) {
                player.energy = 1;
            } else if (player.energy < 0) {
                player.energy = 0;
            } else if (isNaN(player.energy)) {
                player.energy = 1;
            }
        }

        player.health += frameFactor * aircraftSpecs.healthRegen;
        if (player.health > 1) {
            player.health = 1;
        } else if (player.health < 0) {
            player.health = 0;
        }

        // kill shield/inferno timer after it has expired
        if (player.shieldOrInfernoTimer && player.shieldOrInfernoTimer.hasTimedOut) {
            player.shieldOrInfernoTimer = null;
            player.powerUps.inferno = null;
            player.powerUps.shield = null;
        }

        let flightDirection = -999;

        if (player.strafe) {
            /**
             * Copter strafe.
             */
            if (player.keystate.LEFT) {
                flightDirection = player.rot - 0.5 * Math.PI;
            }

            if (player.keystate.RIGHT) {
                flightDirection = player.rot + 0.5 * Math.PI;
            }
        } else if (player.keystate.LEFT || player.keystate.RIGHT) {

            if (player.keystate.LEFT) {
                player.rot -= frameFactor * aircraftSpecs.turnFactor;
            }

            if (player.keystate.RIGHT) {
                player.rot += frameFactor * aircraftSpecs.turnFactor;
            }

            player.rot = ((player.rot % PI_X2) + PI_X2) % PI_X2;
        }

        if (player.keystate.UP) {
            if (flightDirection === -999) {
                flightDirection = player.rot;
            } else {
                flightDirection += Math.PI * (player.keystate.RIGHT ? -0.25 : 0.25);
            }
        } else if (player.keystate.DOWN) {
            if (flightDirection === -999) {
                flightDirection = player.rot + Math.PI;
            } else {
                flightDirection += Math.PI * (player.keystate.RIGHT ? 0.25 : -0.25);
            }
        }

        /**
         * speed update.
         */
        let speedValue = 0;

        if (
            player.speed.x !== 0 ||
            player.speed.y !== 0 ||
            player.keystate.UP ||
            player.keystate.DOWN ||
            player.strafe
        ) {
            const startSpeedX = player.speed.x;
            const startSpeedY = player.speed.y;

            if (flightDirection !== -999) {
                player.speed.x +=
                    Math.sin(flightDirection) * aircraftSpecs.accelFactor * boostFactor * frameFactor;
                player.speed.y -=
                    Math.cos(flightDirection) * aircraftSpecs.accelFactor * boostFactor * frameFactor;
            }

            speedValue = Math.hypot(player.speed.x, player.speed.y);

            let maxspeed =
                aircraftSpecs.maxSpeed * boostFactor * UPGRADES_SPECS.SPEED.factor[player.upgrades.speed];

            if (player.powerUps.inferno) {
                maxspeed *= aircraftSpecs.infernoFactor;
            }

            if (player.flagspeed) {
                maxspeed = aircraftSpecs.flagSpeed;
            }

            if (speedValue > maxspeed) {
                player.speed.x *= maxspeed / speedValue;
                player.speed.y *= maxspeed / speedValue;
            } else if (
                player.speed.x > aircraftSpecs.minSpeed ||
                player.speed.x < -aircraftSpecs.minSpeed ||
                player.speed.y > aircraftSpecs.minSpeed ||
                player.speed.y < -aircraftSpecs.minSpeed
            ) {
                player.speed.x *= 1 - aircraftSpecs.brakeFactor * frameFactor;
                player.speed.y *= 1 - aircraftSpecs.brakeFactor * frameFactor;
            } else {
                player.speed.x = 0;
                player.speed.y = 0;
            }

            /**
             * Update player position.
             */
            player.pos.x += frameFactor * startSpeedX +
                0.5 * (player.speed.x - startSpeedX) * frameFactor * frameFactor;
            player.pos.y += frameFactor * startSpeedY +
                0.5 * (player.speed.y - startSpeedY) * frameFactor * frameFactor;
        }

        /**
         * Validate coords.
         */
        if (player.pos.x < PLAYERS_POSITION.MIN_X) {
            player.pos.x = PLAYERS_POSITION.MIN_X;
        }

        if (player.pos.x > PLAYERS_POSITION.MAX_X) {
            player.pos.x = PLAYERS_POSITION.MAX_X;
        }

        if (player.pos.y < PLAYERS_POSITION.MIN_Y) {
            player.pos.y = PLAYERS_POSITION.MIN_Y;
        }

        if (player.pos.y > PLAYERS_POSITION.MAX_Y) {
            player.pos.y = PLAYERS_POSITION.MAX_Y;
        }
    }
}
