const Game = require('../Entities/Game');

class GameManager{

    constructor(){
        this.game = new Game();
        setInterval(this.game.update.bind(this.game),1000/120)
    }

    addPlayer(socket, username) {
        console.log("Server add player : "+username);
        this.game.addPlayer(socket, username);
    }

    removePlayer(socket) {
        this.game.removePlayer(socket);
    }

    handleInput(socket, dir){
        this.game.handleInput(socket, dir);
    }

}

module.exports = GameManager;