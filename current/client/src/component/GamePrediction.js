import Player from './Player';

class GamePrediction {


    constructor(){
        //id, username, x, y, xCase, yCase, idskin
        this.player = undefined;
        this.lastUpdateTime = 0;
        //new Player(0,"test",0,0,0,0,0);
    }

    setPlayer = (id, username, x, y, xCase, yCase, idskin) => {
        this.player = new Player(id, username, x, y, xCase, yCase, idskin);
    }

    update = () => {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        if(this.player != undefined){
            this.player.update(dt);
        }
        
    }

    setCurrentPlayerFromServer = (me,t) => {
       // console.log(me)
        if(this.player != undefined){
            this.lastUpdateTime = t;
            this.player.x = me.x;
            this.player.y = me.y;
            this.player.direction = me.direction;
            this.player.nextDirection = me.nextdirection;
            this.player.nextCase = me.nextcase;
        } else {
           this.setPlayer(me.id, "", me.x, me.y, 0, 0, me.idskin);
        }
    }

    setDirectionUser = (dir) => {
        if(this.player != undefined) this.player.updateState(dir);
    }


}

export default GamePrediction;