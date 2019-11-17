const Constants = require('../../shared/constants');
const equal = require('deep-equal')

module.exports = class Map {

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

    setCaseOfMap(x,y,value){
        this.map[y][x].color = value.color,
        this.map[y][x].type = value.type,
        this.map[y][x].idPlayer = value.idPlayer;
    }

    addSpawPlayer(player){
        var spawn = player.spawn;
        this.map[spawn.y][spawn.x].type = Constants.TYPECASE.AREA;
        this.map[spawn.y][spawn.x].idPlayer = player.id;
        this.map[spawn.y][spawn.x].color = player.couleur;
    }

    getXYCenterfromCase(xCase,yCase){
        if(xCase < 0 || xCase > this.numberTile-1 || yCase < 0 || yCase > this.numberTile-1) return {};
        var y = yCase * Constants.MAP_TILE + Constants.MAP_TILE/2;
        var x = xCase * Constants.MAP_TILE + Constants.MAP_TILE/2;
        return {x: x, y: y};
    }

    getCaseOfXY(x,y){
        var xc = Math.floor(x/Constants.MAP_TILE);
        var yc = Math.floor(y/Constants.MAP_TILE);
        return {x: xc, y: yc};
    }

    getRandomCaseMap(){
        var x = -1, y = -1;
        x = Math.floor(Math.random() * Math.floor(this.numberTile));
        y = Math.floor(Math.random() * Math.floor(this.numberTile));
        //TODO tant que case is not empty
        return {x: x, y: y};
    }

    getNbAreaPlayer(playerid){
        var cpt = 0;
        for(var y = 0 ; y < this.map.length; y++){
            for(var x = 0; x < this.map[y].length; x++){
                if(this.isCaseAreaPlayer(x,y,playerid)) cpt++;
            }
        }
        return cpt;
    }

    delCaseOf(playerID){
        for(var y = 0 ; y < this.map.length; y++){
            for(var x = 0; x < this.map[y].length; x++){
                if(this.map[y][x].idPlayer == playerID){
                    if(this.map[y][x].path != undefined){
                        //AREA TO PATH OTHER PLAYER
                        var val = {type: Constants.TYPECASE.PATH, idPlayer: this.map[y][x].path.idPlayer, color: this.map[y][x].path.color}
                        this.setCaseOfMap(x,y,val);
                        this.map[y][x].path = undefined;
                    }  
                    else this.map[y][x] = {type: Constants.TYPECASE.VIDE, x: this.map[y][x].x, y: this.map[y][x].y};
                    
                } // SI PAS MA CASE MAIS JAI PATH DESSUS
                if(this.map[y][x].path != undefined && this.map[y][x].path.idPlayer == playerID) this.map[y][x].path = undefined;
            }
        }
    }

    searchNextPathAreaX(x,y,playerid,tab){
        if(x >= this.numberTile) return null;
        else if(this.isCasePlayer(x,y,playerid)) return tab;
        else {
            var res = this.searchNextPathAreaX(x+1,y,playerid,tab);
            if(res != null) { tab.push({x: x, y: y}); return tab;
            } else return null; 
        };
    }

    searchNextPathAreaY(x,y,playerid,tab){
        if(y >= this.numberTile) return null;
        else if(this.isCasePlayer(x,y,playerid)) return tab;
        else {
            var res = this.searchNextPathAreaY(x,y+1,playerid,tab);
            if(res != null) { tab.push({x: x, y: y}); return tab;
            } else return null; 
        }
    }

    getMapPlayer(me){
        var res = this.getCaseOfXY(me.x,me.y);
        var indeXP = 0;
        if(res.y - 20 >= 0 ) indeXP = res.y - 20;
        var filt = Object.values(this.map).slice(indeXP - 20, res.y + 20);

        for(var i = 0; i < filt.length; i++){
            var indeXM = 0;
            if(res.x - 20 >= 0 ) indeXM = res.x - 20;
            filt[i] = filt[i].slice(indeXM, res.x + 20);
        }
     
      //  console.log(filt);
        return filt;
    }

    isCasePlayer(x,y,playerid){
        if(x >= this.numberTile) return true;
        if(y >= this.numberTile) return true;
        if(equal(this.map[y][x].type,Constants.TYPECASE.PATH) && this.map[y][x].idPlayer === playerid) return true
        if(equal(this.map[y][x].type,Constants.TYPECASE.AREA) && this.map[y][x].idPlayer === playerid) return true
        if(equal(this.map[y][x].type,Constants.TYPECASE.AREA) && this.map[y][x].idPlayer !== playerid){
            if(this.map[y][x].path !== undefined && this.map[y][x].path.idPlayer === playerid) return true
        }
        else return false;
    }

    isCasePathPlayer(x,y,playerid){
        return (this.map[y][x].type == Constants.TYPECASE.PATH && this.map[y][x].idPlayer === playerid);
    }

    isCaseAreaPlayer(x,y,playerid){
        return (this.map[y][x].type == Constants.TYPECASE.AREA && this.map[y][x].idPlayer === playerid);
    }

    isCasePathOtherPlayer(x,y,playerid){
        return (this.map[y][x].type == Constants.TYPECASE.PATH && this.map[y][x].idPlayer !== playerid);
    }

    isCaseAreaOtherPlayer(x,y,playerid){
        return (this.map[y][x].type == Constants.TYPECASE.AREA && this.map[y][x].idPlayer !== playerid);
    }

    isCaseEmpty(x,y){
        return (this.map[y][x].type == Constants.TYPECASE.VIDE);
    }

    addPathOnArea(x,y,player){
        if(this.map[y][x].type == Constants.TYPECASE.AREA) {
            this.map[y][x].path = { idPlayer: player.id, type: Constants.TYPECASE.PATH, color: player.couleur};
        }
    }

    pathToArea(player){
        var tabX = new Array();
        var tabY = new Array();

        var value = {
            color: player.couleur,
            type: Constants.TYPECASE.AREA,
            idPlayer: player.id,
            path: {}
        };

        for(var y = 0 ; y < this.map.length; y++){
            for(var x = 0; x < this.map[y].length; x++){
                var b = this.isCasePlayer(x,y,player.id);
                if( b && !this.isCasePlayer(x+1,y,player.id)) this.searchNextPathAreaX(x+1,y,player.id,tabX);
                if( b && !this.isCasePlayer(x,y+1,player.id)) this.searchNextPathAreaY(x,y+1,player.id,tabY);
                if( b ) {
                    if(this.isCasePathPlayer(x,y,player.id)) this.setCaseOfMap(x,y,value);
                    else if(this.isCaseAreaOtherPlayer(x,y,player.id) && this.map[y][x].path != undefined){
                        this.setCaseOfMap(x,y,value);
                        this.map[y][x].path = undefined;
                    }
                }
            }
        }

        var elem = {};
        var i;
       for(i = 0; i < tabX.length; i++){
           elem = tabY.find((element) => {return element.x == tabX[i].x && element.y == tabX[i].y});
           if(elem != undefined) this.setCaseOfMap(tabX[i].x,tabX[i].y,value);
       }

       for(i = 0; i < tabY.length; i++){
            elem = tabX.find((element) => {return element.x == tabY[i].x && element.y == tabY[i].y});
            if(elem != undefined) this.setCaseOfMap(tabY[i].x,tabY[i].y,value);
        }
    }

}