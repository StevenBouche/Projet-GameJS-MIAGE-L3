export default class Map {
//STAGE variable

    constructor(){
        this.numberTileW = 40;
        this.numberTileH = 40;
        this.map = new Array(this.numberTileH);
        this.map.fill(new Array(this.numberTileW).fill(1,0,this.numberTileW-1),0,this.numberTileH-1);
      //  this.constructMap();
    }

    constructMap(){
        for(var i = 0; i < this.numberTileH; i++){
            this.map[i] = new Array();
            this.map[i].fill(1,0,this.numberTileW-1);
            console.log(this.map[i])
        }
    }

    getMap(x,y,nbTW,nbTH){
        var screen = new Array();   
      //  console.log(nbTW+" "+nbTH)
      //  console.log(x-nbTW,y-nbTH)
        var current = { x: Math.round(x-nbTW), y: Math.round(y-nbTH) }

        for(var i = 0; i <= nbTH*2+1; i++)
        {   screen[i] = new Array();
            var tab = [];
            for(var z = 0; z <= nbTW*2+1; z++){
             //   screen[i].push()
                if(i == nbTH && z == nbTW) screen[i][z] = 2;
                else {
                    try {
                        screen[i][z] = this.map[current.y][current.x];
                    } catch (error){
                      //  console.log(error)
                        screen[i][z] = 0;
                    }
                }
                current.x++;
            }
            current.x = Math.round(x-nbTW);
            current.y++;
        }

        return screen;
    }
}