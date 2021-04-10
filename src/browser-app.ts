declare var timestamp: string;

import { BotState } from "./botting/bot-state";
import { BrowserContext } from "./browser-impl/browser-context";
import { LandingPage } from "./browser-impl/landing-page";

BotState.createPathFindingWorker = () => new Worker('browser-worker-pack.js?v=' + timestamp);

const landingPage = new LandingPage(new BrowserContext());
landingPage.run();

