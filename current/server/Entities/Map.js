const Constants = require('../shared/constants');

module.exports = class Map {
//STAGE variable

    constructor(){
        this.numberTile = Constants.MAP_SIZE / Constants.MAP_TILE;
        console.log(this.numberTile)
        this.map = new Array(this.numberTile);
        this.init();
    }

    init(){
        for(var y = 0 ; y < this.map.length; y++){
            this.map[y] = new Array(this.numberTile);
            for(var x = 0; x < this.map[y].length; x++){
                var xy = this.getXYCenterfromCase(x,y);
                this.map[y][x] = {type: Constants.TYPECASE.VIDE, x: xy.x, y: xy.y};
            }
        }
    }

    getMap(){
      
    }

    getXYCenterfromCase(xCase,yCase){
        
        if(xCase < 0 || xCase > this.numberTile-1 || yCase < 0 || yCase > this.numberTile-1) return {};
        var y = yCase * Constants.MAP_TILE + Constants.MAP_TILE/2;
        var x = xCase * Constants.MAP_TILE + Constants.MAP_TILE/2;
      //  console.log(xCase,yCase,x,y)
        return {x: x, y: y};
    }

    getRandomCaseMap(){
        var x = -1, y = -1;
        x = Math.floor(Math.random() * Math.floor(this.numberTile));
        y = Math.floor(Math.random() * Math.floor(this.numberTile));
        return {x: x, y: y};
    }
}