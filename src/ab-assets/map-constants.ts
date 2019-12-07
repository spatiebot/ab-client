// this file is a partial copy of ab-server\src\constants\collisions.ts and players.ts
/* tslint:disable */ // rules are different

export const MAP_SIZE = {
    WIDTH: 32768,
    HEIGHT: 16384,

    HALF_WIDTH: 32768 / 2,
    HALF_HEIGHT: 16384 / 2,
};

export const MAP_COORDS = {
    MIN_X: -MAP_SIZE.WIDTH / 2,
    MIN_Y: -MAP_SIZE.HEIGHT / 2,
    MAX_X: MAP_SIZE.WIDTH / 2,
    MAX_Y: MAP_SIZE.HEIGHT / 2,
};

export const PLAYERS_POSITION = {
    MIN_X: -16352,
    MIN_Y: -8160,

    MAX_X: 16352,
    MAX_Y: 8160,
};