const Game = require('../Entities/Game');
const Constants = require('./../../shared/constants');

class GameManager{

    constructor(){
        this.stateGame = [];
        this.game = new Game();
        this.int = undefined;
        this.loopProgress = false;
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
        this.game.handleInput(socket, dir);
    }
    
    startGame = () => {
         //this.int = setInterval(this.game.update,1000/Constants.UI_REFRESH_HZ);
         this.int = setInterval(this.updateState,1000/Constants.UI_REFRESH_HZ);
    }

    updateState = () => {
        //feature prise en compte du ping
        if(this.stateGame.length >= 100) this.stateGame.splice(0,1);
        //Revoir
        if(this.loopProgress == true ) return;
        this.loopProgress = true;
        this.game.update();
        this.stateGame.push(this.game.clone());
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