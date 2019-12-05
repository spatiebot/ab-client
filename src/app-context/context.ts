import { Settings } from "./settings";
import { ILogger } from "./ilogger";
import { EventQueue } from "../events/event-queue";
import { Logger } from "../node-impl/logger";
import { ServerMessageHandler } from "../handlers/server-message-handler";
import { ChatLogger } from "../handlers/chat-logger";
import { TimerManager } from "./timer-manager";
import { IMessageHandler } from "../handlers/imessage-handler";
import { EventQueueProcessor } from "./eventqueue-processor";
import { State } from "./state";
import { LoginHandler } from "../handlers/server-messages/login-handler";
import { ScoreUpdateHandler } from "../handlers/server-messages/score-update-handler";
import { PlayerNewHandler } from "../handlers/server-messages/player-new-handler";
import { PlayerBounceHandler } from "../handlers/server-messages/player-bounce-handler";
import { PlayerBoostHandler } from "../handlers/server-messages/player-boost-handler";
import { PlayerUpdateHandler } from "../handlers/server-messages/player-update-handler";
import { TeamsHandler } from "../handlers/server-messages/teams-handler";
import { PlayerUpgradeHandler } from "../handlers/server-messages/player-upgrade-handler";
import { PlayerRespawnHandler } from "../handlers/server-messages/player-respawn-handler";
import { PlayerSwitchTypeHandler } from "../handlers/server-messages/player-switch-type-handler";
import { PlayerKilledHandler } from "../handlers/server-messages/player-killed-handler";
import { PlayerLeaveHandler } from "../handlers/server-messages/player-leave-handler";
import { PlayerFireHandler } from "../handlers/server-messages/player-fire-handler";
import { PlayerHitHandler } from "../handlers/server-messages/player-hit-handler";
import { ScoreBoardHandler } from "../handlers/server-messages/score-board-handler";
import { MiniMapHandler } from "../handlers/server-messages/mini-map-handler";
import { CrateNewHandler } from "../handlers/server-messages/crate-new-handler";
import { MissileUpdateHandler } from "../handlers/server-messages/missile-update-handler";
import { MountainHitHandler } from "../handlers/server-messages/mountain-hit-handler";
import { MobDespawnHandler } from "../handlers/server-messages/mob-despawn-handler";
import { PlayerRepelHandler } from "../handlers/server-messages/player-repel-handler";
import { PlayerStealthHandler } from "../handlers/server-messages/player-stealth-handler";
import { LeaveHorizonHandler } from "../handlers/server-messages/leave-horizon-handler";
import { PlayerPowerupHandler } from "../handlers/server-messages/player-powerup-handler";
import { ServerAnnouncementHandler } from "../handlers/server-messages/server-announcement-handler";
import { FlagUpdateHandler } from "../handlers/server-messages/flag-update-handler";
import { ServerCustomHandler } from "../handlers/server-messages/server-custom-handler";
import { ServerCommandReplyHandler } from "../handlers/server-messages/server-command-reply-handler";
import { ServerErrorHandler } from "../handlers/server-messages/server-error-handler";
import { PlayerChangeFlagHandler } from "../handlers/server-messages/player-change-flag-handler";
import { ScoreDetailedHandler } from "../handlers/server-messages/score-detailed-handler";

export class Context {

    settings = new Settings();
    logger: ILogger = new Logger(this.settings); // use nodejs specific for now
    eventQueue = new EventQueue();
    tm = new TimerManager();
    processor = new EventQueueProcessor(this);
    state = new State();
        
    handlers: IMessageHandler[] = [
        // default handlers (always needed)
        new CrateNewHandler(this),
        new FlagUpdateHandler(this),
        new LeaveHorizonHandler(this),
        new LoginHandler(this),
        new MiniMapHandler(this),
        new MissileUpdateHandler(this),
        new MobDespawnHandler(this),
        new MountainHitHandler(this),
        new PlayerBoostHandler(this),
        new PlayerBounceHandler(this),
        new PlayerChangeFlagHandler(this),
        new PlayerFireHandler(this),
        new PlayerHitHandler(this),
        new PlayerKilledHandler(this),
        new PlayerLeaveHandler(this),
        new PlayerNewHandler(this),
        new PlayerPowerupHandler(this),
        new PlayerRepelHandler(this),
        new PlayerRespawnHandler(this),
        new PlayerStealthHandler(this),
        new PlayerSwitchTypeHandler(this),
        new PlayerUpdateHandler(this),
        new PlayerUpgradeHandler(this),
        new ServerCommandReplyHandler(this),
        new ServerCustomHandler(this),
        new ServerErrorHandler(this),
        new ServerMessageHandler(this),
        new ServerAnnouncementHandler(this),
        new ScoreBoardHandler(this),
        new ScoreDetailedHandler(this),
        new ScoreUpdateHandler(this),
        new TeamsHandler(this),

        // application handlers
        new ChatLogger(this),
    ];


}