# How it works

The application is totally eventbased. 

- A timer ticks at about 60 times per second and will at each tick call all handlers that want to do something at each tick (for example update the screen to represent the game state)
- User input calls handlers that want to do something at certain userinput (for example switch aircraft at F1-F5 press)
- Server events will trigger handlers that want to act on these events. This is mostly updating the game state.

The central point of the application is the IContext implementation, for the browser this is the [`BrowserContext`](src/browser-impl/browser-context.ts) class. The most important in this class are the [`state`](src/app-context/state.ts) property and the handlers. 

## State

The state, as expected, contains the current state of the game. State is updated by server events, but also by timer ticks, because some state has to be "filled in" by the client. For example: the server only sends positions of another player if that player changes direction, speed, rotation, etc. If the player is flying in a straight line, the client has to calculate the position of the plane by itself. These extrapolations are done in two handlers: the [`MissileMaintenanceHandler`](src/handlers/maintenance/missile-maintenance-handler.ts) and the [`PlayerMaintenanceHandler`](src/handlers/maintenance/player-maintenance-handler.ts). 

This doesn't work perfect. The original game had a mechanism to correct lags. I simply don't get the mechanism, and did my best to implement something similar. This code lives in [`Connection.calibrateTime`](src/connectivity/connection.ts) and is used by the [`EventQueueProcessor.tick`](src/app-context/eventqueue-processor.ts) to do some correction, but my impression is that it's not working as well as the original game, which is not a surprise given the fact that I don't understand what I'm doing.

Server events of course do a lot of the updating of the state. An example is the [`PlayerFireHandler`](src/handlers/server-messages/player-fire-handler.ts), which adds mobs for each missile to the state. Other handlers are in the same directory.

## Handlers

The BrowserContext defines all handlers that will act on events. Each handler has a property which definies which event it will act upon. The earlier PlayerFireHandler example has a property `public handles = [Events.PLAYER_FIRE];`, with which the handler subscribes itself to the PLAYER_FIRE event. 

All events in the `Events` enum are client events: all server events are also directly translated to client events by the [`ServerMessageHandler`](src/handlers/server-message-handler.ts).

User input is NOT handled by this mechanism. Userinput always directly calls the server to do something. The server will in most cases translate this in a server message, which in turn will lead to a client event.

## Rendering

Special handlers are the handlers that do the rendering. 

The most extended handler is the [`GameRenderHandler`](src/handlers/render/game-render-handler.ts). This handler is subscribed to the `TICK` event, and will delegate all rendering to the [`Renderer`](/src/browser-impl/renderers/renderer.ts).

The `Renderer` fills all elements which are defined in the main [`index.html`](static/index.html). The most important part is a `Canvas` element on which all moving parts are drawn. Around the canvas a few other elements are positioned, like the minimap, the player list, etc. 

The Renderers main method is `renderGame`, which draws all moving elements on the `Canvas`. It delegates to different classes:

- it first calculates which part of the map is shown (around the center point, which is always the player at this point; when spectating it is the spectated player). The calculation is done by the [`ClippedView`](src/browser-impl/clipped-view.ts) class. This class does the translation and scaling of elements.
- then it clears the canvas and draws the background from a static png holding the world map, this is done by the [`BackgroundRenderer`](src/browser-impl/renderers/background-renderer.ts)
- on top of the background the mountains or "walls" are drawn. These are several png images of different sizes. This is done by the [`WallsRenderer`](src/browser-impl/renderers/walls-renderer.ts)
- the [`UpcratesRenderer`](src/browser-impl/renderers/upcrates-renderer.ts) draws all crates in sight
- the [`PlayersRenderer`](src/browser-impl/renderers/players-renderer.ts) draws the aircraft images on top of this, with the correct rotation, and with the head-up diplay with name, level, position, score, ping, health and energy. 
- the [`MissilesRenderer`](src/browser-impl/renderers/missiles-renderer.ts) does the same for missiles
- all explosions and chemtrails and stuff are rendered by the quite simplistic [`EffectsRenderer`](effects-build/browser-impl/renderers/effects-renderer.js.ts) (or `explosionsrenderer` as it's called in the `Renderer`). 
- finally, in CTF, the flag position is drawn by the [`FlagRenderer`](src/browser-impl/renderers/flag-renderer.ts).

Note that one tick renders a static image each time, there is no movement at all in this list. The illusion of movement is created by drawing this cycle each time over and over again with new positions, at around 60 FPS. 

The `Renderer` also serves the other HTML elements with the score list, minimap, etc, but those are way more simple: often just simple DOM manipulation.

Note that there are no external libraries for manipulating the DOM or rendering graphics. 



