import { BrowserContext } from "./browser-impl/browser-context";
import { LandingPage } from "./browser-impl/landing-page";

const landingPage = new LandingPage(new BrowserContext());
landingPage.run();
