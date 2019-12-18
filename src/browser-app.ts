import { BrowserContext } from "./browser-impl/browser-context";

class App {

    public async run() {
        const context = new BrowserContext();
        await context.start();
    }
}

const app = new App();
// app.run();

import { Canvg } from "canvg";
import { MAP_SIZE } from "./ab-protocol/src/lib";

let v = null;

window.onload = async () => {

    const fullWidth = MAP_SIZE.WIDTH;
    const fullHeight = MAP_SIZE.HEIGHT;

    const scale = 3;
    const width = fullWidth / scale;
    const height = fullHeight / scale;

    const canvas = document.querySelector("#map") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    v = await Canvg.from(ctx, "./map-miller.svg", {
        ignoreDimensions: true,
        scaleHeight: width,
        scaleWidth: height,
    });
    await v.render();

    const canvas2 = document.querySelector("#map2") as HTMLCanvasElement;
    const ctx2 = canvas2.getContext("2d");

    canvas2.width = fullWidth;
    canvas2.height = fullHeight;

    // ctx2.drawImage(canvas, 0, 0, width / 4, height / 4, 0, 0, fullWidth / 4, fullHeight / 4);

    // canvas.style.display = "none";
};
