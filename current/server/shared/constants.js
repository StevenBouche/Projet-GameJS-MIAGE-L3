module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 250,
  SCORE_PER_SECOND: 1,
  UI_REFRESH_HZ: 120,
  MAP_SIZE: 1000,
  MAP_TILE: 50,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    PING: 'PINGPONG',
    PONG: 'PONGPING'
  },

  INPUT: {
    N: {vx: 0, vy: 1}, // canvas en -y x
    S: {vx: 0, vy: -1},
    E: {vx: 1, vy: 0},
    O: {vx: -1, vy: 0},
    STOP: {vx: 0, vy: 0}
  },

  TYPECASE: {
    VIDE: 0,
    PATH: 1,
    AREA: 2
  }
});
