import Player from '../class/Player'

class PlayerManager {

    constructor(){
        this.player = new Player(100,100,15,15,'red');
    }

    update(context,deltaTime){
        this.player.draw(context,deltaTime);
    }
}

var Singleton = (function () {
    var instance;
    
    function createInstance() {
        var object = new PlayerManager();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) { instance = createInstance();}
            return instance;
        }
    };
})();

export default Singleton;

