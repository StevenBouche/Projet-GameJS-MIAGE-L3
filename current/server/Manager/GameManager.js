const Game = require('../Entities/Game');

class GameManager{

    constructor(){
        this.game = new Game();
        setInterval(this.game.update.bind(this.game),1000/60)
    }

    addPlayer(socket, username) {
        console.log("Server add player : "+username);
        this.game.addPlayer(socket, username);
    }

    removePlayer(socket) {
        this.game.removePlayer(socket);
    }

}

module.exports = GameManager;