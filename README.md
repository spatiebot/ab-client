# ab-client
A hybrid nodejs and browser client for airmash.

It's in a playable state, but there is still work to do. See the Issues list.

The latest build of the browser client is hosted at https://spatiebot.github.io.

For some technical inside information, see [How it works](HowItWorks.md).

# starting the web client using Docker

clone repository and submodule  
`git clone --recurse-submodules git://github.com/spatiebot/ab-client.git`

If you want the container to also be able to connect to a local server, edit the `.env` file to include a local url, before running docker build:    
`LOCAL_SERVER_URL=ws://localhost:3501`

build a container with the web client:  
`docker build -t ab-client .`  

run the web client on port 8080:  
`docker run -p 8080:80 -d ab-client`  

# building locally

You'll need Node v12 or more.

clone repository and submodule  
`git clone --recurse-submodules git://github.com/spatiebot/ab-client.git`  

install deps  
`npm i`

to create a browser client in dist/:  
`npm run build`   

to build a dev client and serve on port 1234:  
`npm run serve`  

To run a local browser client that can connect to a local server, edit the `.env` file to include a local url:  
`LOCAL_SERVER_URL=ws://localhost:3501`

# styling

A lot of the assets and styling are configurable.

- `/src/_less/styles/<stylename>/style.less` contains all CSS for the UI. 
- `/static/styles/<stylename>/*.png` are all images that are used for this style.
- `/static/styles/<stylename>/constants.js` defines the colors that are used while drawing the game on the canvas. A new style can ignore the NO_BITMAPS colors: those are only used for the special bare-bones no-bitmap style.

All files in the style should be referenced from index.html, because parcel won't deploy them otherwise.

# attribution

- Flags from https://github.com/gosquared/flags, except for the jolly and rainbow flag, which are from Wikipedia.  
- The map is a slightly distorted version of the Miller projection. SVG file from Wikipedia https://commons.wikimedia.org/wiki/File:World_map_(Miller_cylindrical_projection,_blank).svg  
- The aircrafts are handdrawn with Inkscape from the shapes of real aircrafts:
  - F16 for the raptor
  - B2 for the goliath
  - Mirage for the tornado
  - Apache for the mohawk
  - F19 for the prowler
  
