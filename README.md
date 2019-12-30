# ab-client
A hybrid nodejs and browser client for airmash.

It's in a playable state, but there is still work to do. See the Issues list.

The latest build of the browser client is hosted at https://spatiebot.github.io.

# building

You'll need Node v12 or more, and the gulp-cli.

1. clone repository and submodule (`git clone --recurse-submodules git://github.com/spatiebot/ab-client.git`)
2. `npm i`

to create a browser client:

- `gulp browser`
or
- `gulp browser-prod`

will result in dist/index.html with a *very* premature browser client. The "prod" variant will be minified.

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
  
