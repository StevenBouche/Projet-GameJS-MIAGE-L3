import Player from '../class/Player'


class PlayerManager {

    constructor(size){
        this.player = new Player(0,0,size,size,'red');
    }
}

var Singleton = (function () {
    var instance;
    
    function createInstance(sizeT) {
        var object = new PlayerManager(sizeT);
        return object;
    }
 
    return {
        getInstance: function (sizeT) {
            if (!instance) { instance = createInstance(sizeT);}
            return instance;
        }
    };
})();

export default Singleton;

