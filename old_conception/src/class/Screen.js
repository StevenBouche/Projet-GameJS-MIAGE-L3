export default class Screen {

        constructor(nbtw,nbth){
            this.numberTileW = nbtw;
            this.numberTileH = nbth;
            this.map = new Array();
            this.constructScreen();
        }

        constructScreen(){
            for(var i = 0; i < this.numberTileH; i++){
                this.map[i] = new Array();
                for(var x = 0; x < this.numberTileH; x++){
                    this.map[i][x] = undefined;
                }
            }
        }
    
    }