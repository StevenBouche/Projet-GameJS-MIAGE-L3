import Player from './Player';

class GamePrediction {


    constructor(){
        //id, username, x, y, xCase, yCase, idskin
        this.player = undefined;
        this.predictionPlayer = [];
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
            if(this.predictionPlayer.length > 100) this.predictionPlayer.shift();
            this.predictionPlayer.push(this.player.serializeForUpdate());
        
            
           // console.log(this.predictionPlayer)
        }
        
    }

    setCurrentPlayerFromServer = (me,t) => {
       // console.log(me)
        if(this.player != undefined){
            //this.lastUpdateTime = t;
            if (this.predictionPlayer[0] == undefined) return ;

            
            if(this.predictionPlayer[0].x != me.x || this.predictionPlayer[0].y != me.y){
               // console.log("RECALCULE")
                this.player.x = me.x;
                this.player.y = me.y;
                this.player.direction = me.direction;
                this.player.nextDirection = me.nextdirection;
                this.player.nextCase = me.nextcase;
                this.player.color = me.color;
                for(let i =0; i+1 < this.predictionPlayer.lenght; i++){
                    
                    let pre = this.predictionPlayer[i+1];
                    this.player.update(pre.dt);
                    this.predictionPlayer[i+1] = this.player.serializeForUpdate();
                   // console.log(this.predictionPlayer[i+1])
                }
                this.predictionPlayer.shift();
            }
        } else {
           this.setPlayer(me.id, "", me.x, me.y, 0, 0, me.idskin);
        }
    }

    setDirectionUser = (dir) => {
        if(this.player != undefined) this.player.updateState(dir);
    }

    getLastPrediction = () => {
        
        return this.predictionPlayer[this.predictionPlayer.length-1];
    }


}

export default GamePrediction;