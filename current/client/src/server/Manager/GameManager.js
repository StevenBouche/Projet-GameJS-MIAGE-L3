const Game = require('../Entities/Game');
const Constants = require('./../../shared/constants');

class GameManager{

    constructor(){
        this.game = new Game();
        this.int = setInterval(this.game.update,1000/Constants.UI_REFRESH_HZ);
       // setInterval(this.game.serviceCamPlayer,1000/Constants.UI_REFRESH_HZ);
    }

    addPlayer(socket, dataUser) {
        const {username,idskin} = dataUser;
        console.log("Server add player : "+username);
        this.game.addPlayer(socket, username, idskin);
    }

    removePlayer(socket) {
        this.game.playerDie(socket.id);
    }

    handleInput(socket, dir){
        this.game.handleInput(socket, dir);
    }

}

module.exports = GameManager;