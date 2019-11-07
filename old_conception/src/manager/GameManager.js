import PlayerManager from './PlayerManager'
import NetworkManager from '../network/NetworkManager'
import ViewManager from './ViewManager'
import Map from '../class/Map'

class GameManager {

    constructor(){

        this.ID = '_' + Math.random().toString(36).substr(2, 9);
        this.mapGame = new Map();
        this.playerManager = PlayerManager.getInstance(28);

        this.viewManager = ViewManager.getInstance(this);
    }

    getPlayer(){return this.playerManager.player;}

    getScreenPlayer(nbTileW,nbTileH,sizeTile){
        var player = this.getPlayer();
        var pos = this.playerManager.player.getPosition();
        var posx = Math.trunc(pos.x/sizeTile);
        var posy = Math.trunc(pos.y/sizeTile);
        return this.mapGame.getMap(posx, posy, nbTileW, nbTileH);
    }

    getMapGame(){
        return this.mapGame.map;
    }

}

var Singleton = (function () {
    var instance;
    
    function createInstance() {
        var object = new GameManager();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default Singleton;

