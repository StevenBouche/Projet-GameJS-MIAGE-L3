const ObjectClass = require('./Object');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Constants.PLAYER_SPEED);
    this.username = username;
    this.score = 0;
  }

  update(dt) {
    super.update(dt);
    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;
    // Make sure the player stays in bounds
    
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
    };
  }
}

module.exports = Player;
