# ab-client
A hybrid nodejs and browser client for airmash.

It's in a playable state, but there is still work to do. See the Issues list.

The latest build of the browser client is hosted at https://spatiebot.github.io.

# styling

A lot of the assets and styling are configurable.

- `/src/_less/styles/<stylename>/style.less` contains all CSS for the UI. 
- `/static/styles/<stylename>/*.png` are all images that are used for this style.
- `/static/styles/<stylename>/constants.json` defines the colors that are used while drawing the game on the canvas. A new style can ignore the NO_BITMAPS colors: those are only used for the special bare-bones no-bitmap style.

# building

You'll need Node v12 or more, and the gulp-cli.

1. clone repository and submodule (`git clone --recurse-submodules git://github.com/spatiebot/ab-client.git`)
2. `npm i`

to create a browser client:

- `gulp browser`
or
- `gulp browser-prod`

will result in dist/index.html with the browser client. The "prod" variant will be minified.  
To play the game, you need to start an HTTP server in the dist directory, for example using the nmp module "http-server".

- `gulp`

will result in dist/app.js with a nodejs client that only logs chat messages.

# attribution

- Flags from https://github.com/gosquared/flags, except for the jolly and rainbow flag, which are from Wikipedia.  
- The map is a slightly distorted version of the Miller projection. SVG file from Wikipedia https://commons.wikimedia.org/wiki/File:World_map_(Miller_cylindrical_projection,_blank).svg  
- The aircrafts are handdrawn with Inkscape from the shapes of real aircrafts:
  - F16 for the raptor
  - B2 for the goliath
  - Mirage for the tornado
  - Apache for the mohawk
  - F19 for the prowler
  
