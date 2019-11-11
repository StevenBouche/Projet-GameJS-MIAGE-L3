const Game = require('../Entities/Game');

class GameManager{

    constructor(){
        this.game = new Game();
        this.int = setInterval(this.game.update.bind(this.game),1000/120)
    }

    gameLoop(){
       // try {
            
      //  } catch (error) {
      //      console.log(error)
  //          this.game = new Game();
      //  }
    }

    addPlayer(socket, username) {
        console.log("Server add player : "+username);
        this.game.addPlayer(socket, username);
    }

    removePlayer(socket) {
        this.game.playerDie(socket.id);
    }

    handleInput(socket, dir){
        this.game.handleInput(socket, dir);
    }

}

module.exports = GameManager;