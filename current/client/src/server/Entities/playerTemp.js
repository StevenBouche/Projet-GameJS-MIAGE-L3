const ObjectClass = require('./Object');
const Constants = require('../../shared/constants');
var equal = require('deep-equal');

let generateColor = () => {
  let r = 255*Math.random()|0,g = 255*Math.random()|0,b = 255*Math.random()|0;
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

class Player extends ObjectClass {

  constructor(id, username, x, y, xCase, yCase, idskin) {

    // Construct object
  /*  super(id, x, y, Constants.PLAYER_SPEED);
    this.username = username;
    this.spawn = {x: xCase, y: yCase};
    this.idSkin = idskin;

    //Init des variables du player
    this.score = 0;
    this.currentCase = {x: 0, y: 0};
    this.nextDirection = {vx: 0, vy: 0};
    this.nextCase = {x: undefined, y: undefined};
    this.couleur = generateColor();
    //Si la derniere case etait une AREA
    this.lastCaseArea = false;*/




 super(id, x, y, Constants.PLAYER_SPEED);
    this.username = username;
    this.score = 0;
    this.currentCase = {x: 0, y: 0};
    this.nextDirection = {vx: 0, vy: 0};
    this.nextCase = {x: undefined, y: undefined};
    this.spawn = {x: xCase, y: yCase}
    var r = 255*Math.random()|0,g = 255*Math.random()|0,b = 255*Math.random()|0;
    this.couleur = 'rgb(' + r + ',' + g + ',' + b + ')';
    this.lastCaseArea = false;
    this.map = [];
    this.idSkin = idskin;
    console.log("idSkin :"+idskin)
  }

  setLastArea(bool){ 
    this.lastCaseArea = bool;
  }

  setNextCaseX(caseX){
    this.x = caseX; 
    this.switchState();
  }

  setNextCaseY(caseY){
    this.y = caseY; 
    this.switchState();
  }

  update(dt){
    
    //alias
    var dir = this.direction;
    console.log("update")
    
    //Gere tous les etats possible du joueur, 
    //la direction ne peut pas changer temps que le joueur n'est pas arriver au centre de la case
    if(this.nextCase.x == undefined && this.nextCase.y == undefined) this.updateNextState();

    switch (dir) {
      case Constants.INPUT.N: if(this.y > this.nextCase.y) this.updatePosition(dt); else this.setNextCaseY(this.nextCase.y);break;
      case Constants.INPUT.S: if(this.y < this.nextCase.y) this.updatePosition(dt); else this.setNextCaseY(this.nextCase.y); break;
      case Constants.INPUT.E: if(this.x < this.nextCase.x) this.updatePosition(dt); else this.setNextCaseX(this.nextCase.x); break;
      case Constants.INPUT.O: if(this.x > this.nextCase.x) this.updatePosition(dt); else this.setNextCaseX(this.nextCase.x); break;
      case Constants.INPUT.STOP: this.switchState(); break;
      default: this.direction = Constants.INPUT.STOP; this.switchState(); break;
    }
  }

  setCurrentCase(current){
    if(!equal(this.currentCase,current)) {
      this.currentCase = current; return true;
    }
    return false;
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
      score: this.score,
      color: this.couleur,
      idskin: this.idSkin
    };
  }
}

module.exports = Player;
