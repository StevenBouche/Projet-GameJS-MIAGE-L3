const Game = require('../Entities/Game');
const Constants = require('./../../shared/constants');
const GameState = require('../Entities/GameState');

class GameManager{

    constructor(){
       // this.stateGame = [];
        this.game = new Game();
        this.stateGame = new GameState();
        this.int = undefined;
        this.loopProgress = false;
        this.lastUpdateTime = 0;
        this.firstLoop = true;
        this.startGame();
        
       // setInterval(this.game.serviceCamPlayer,1000/Constants.UI_REFRESH_HZ);
    }

    addPlayer = (socket, dataUser) => {
        const {username,idskin} = dataUser;
        console.log("Server add player : "+username);
        this.game.addPlayer(socket, username, idskin);
    }

    removePlayer = (socket) => {
        this.game.playerDie(socket.id);
    }

    handleInput = (socket, dir) => {
        let direction = dir.dir;
        this.stateGame.addInput(dir,socket.id);
      //  this.game.handleInput(socket, direction);
    }
    
    startGame = () => {
         //this.int = setInterval(this.game.update,1000/Constants.UI_REFRESH_HZ);
         this.int = setInterval(this.updateState,1000/Constants.UI_REFRESH_HZ);
    }

    updateState = () => {

        let now = Date.now();
        let dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;
     
        if(this.loopProgress == true ) return;
        this.loopProgress = true;

        let b = this.stateGame.haveInputUnprocceded();
  
        if(b == true){
            this.stateGame.update();
            let last = this.stateGame.getLastUpdateGame();
            if(last != undefined)  {
            
              this.game = last;
               // Object.assign(this.game, last);
         
            }
        } else if (b == false) {
            this.game.t = now;
            this.game.update(dt,now);
            
        //    this.stateGame.bufferState
        //    this.stateGame.bufferState = this.stateGame.insertKey(this.game.t,this.game.clone(),this.stateGame.bufferState,Object.keys(this.stateGame.bufferState).length);
        //      console.log(this.stateGame.bufferState)
            this.stateGame.addState(this.game.clone());
        }

        this.game.sendDatatoPlayer();
        this.loopProgress = false;
    }

    restartGame = () => {
        // TODO deconnexion client ?
        if(!this.int){
            clearInterval(this.int);
            this.stateGame.splice(0,this.stateGame.length);
            this.game = new Game();
            this.int = setInterval(this.updateState,1000/Constants.UI_REFRESH_HZ);
        }
    }
}

module.exports = GameManager;