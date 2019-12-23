# ab-client
A hybrid nodejs and browser client for airmash.

It's in a very premature state. For example: it looks terrible, CTF doesn't work, etc. Todolist on [Trello](https://trello.com/b/PFLmPiJ2/ab-client)

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
- The aircrafts are handdrawn with Inkscape, but may resemble the Airmash aircrafts too much: the author of Airmash, Tony, owns the copyright of the original aircraft artwork.
