const Game = require('../Entities/Game');

class GameManager{

    constructor(){
        this.game = new Game();
        this.int = setInterval(this.game.update,1000/60)
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