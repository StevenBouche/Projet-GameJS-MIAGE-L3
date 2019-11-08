const ObjectClass = require('./Object');
const Constants = require('../shared/constants');
var equal = require('deep-equal');

class Player extends ObjectClass {
  constructor(id, username, x, y, xCase, yCase) {
    super(id, x, y, Constants.PLAYER_SPEED);
    this.username = username;
    this.score = 0;
    this.nextDirection = {vx: 0, vy: 0};
    this.nextCase = {x: undefined, y: undefined};
    this.spawn = {x: xCase, y: yCase}
  }

  update(dt) {
    
    var dir = this.direction;
    

    if(this.nextCase.x == undefined && this.nextCase.y == undefined) this.updateNextState();

    if(equal(dir,Constants.INPUT.N)) {
      if(this.y > this.nextCase.y) this.updatePosition(dt);
      else { this.y = this.nextCase.y; this.switchState() }
    }  
    else if (equal(dir,Constants.INPUT.S)) {
      if(this.y < this.nextCase.y) this.updatePosition(dt);
      else { this.y = this.nextCase.y; this.switchState() }
    } 
    else if(equal(dir,Constants.INPUT.E)){
      if(this.x < this.nextCase.x) this.updatePosition(dt);
      else { this.x = this.nextCase.x; this.switchState() }
    }
    else if(equal(dir,Constants.INPUT.O)){
      if(this.x > this.nextCase.x) this.updatePosition(dt);
      else { this.x = this.nextCase.x; this.switchState() }
    }
    else if(equal(dir,Constants.INPUT.STOP)) {
      this.switchState();
    } else {
      this.direction = Constants.INPUT.STOP;
      this.switchState();
    }
  }

  switchState(){
    this.direction = this.nextDirection;
    this.updateState(this.direction);
    this.updateNextState();
  }

  updatePosition(dt){
    super.update(dt);
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }

  updateNextState(){
    var dir = this.nextDirection;
    if(equal(dir,Constants.INPUT.N)) this.nextCase = {x: this.x, y: this.y - Constants.MAP_TILE};
    else if (equal(dir,Constants.INPUT.S)) this.nextCase = {x: this.x, y: this.y + Constants.MAP_TILE};
    else if(equal(dir,Constants.INPUT.E)) this.nextCase = {x: this.x + Constants.MAP_TILE, y: this.y};
    else if(equal(dir,Constants.INPUT.O)) this.nextCase = {x: this.x - Constants.MAP_TILE, y: this.y};
    else if(equal(dir,Constants.INPUT.STOP)) this.nextCase = {x: this.x, y: this.y};

    if(this.nextCase.x < 0 || this.nextCase.y < 0 ||this.nextCase.x > Constants.MAP_SIZE || this.nextCase.y > Constants.MAP_SIZE){
      this.direction = Constants.INPUT.STOP;
      this.nextCase = {x: 0, y: 0}
    }

  }

  updateState(dir){
    this.nextDirection = dir;
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
