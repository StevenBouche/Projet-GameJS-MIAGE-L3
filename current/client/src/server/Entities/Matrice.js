const Constants = require('../../shared/constants');
const equal = require('deep-equal')

module.exports = class Matrice {

    constructor(){
        this.numberTile = Constants.MAP_SIZE / Constants.MAP_TILE;
        this.map = [];
        this.init();
    }

    init(){
       // console.log(this.numberTile)
        for(var y = 0; y < this.numberTile; y ++){
            for(var x = 0; x < this.numberTile; x++){
                var xy = this.getXYCenterfromCase(x,y);
                var element = { key: {x:x,y:y}, value: {type: Constants.TYPECASE.VIDE, x: xy.x, y: xy.y}};
             //   console.log(element)
                this.map.push(element);
            }
        }
    }

    getElementMap(x,y){
      //  console.log(x,y)
        var elem = this.map.find(element => element.key.x === x && element.key.y === y);
      //  console.log(elem);
        return elem;
    }

    setElementMap(x,y,value){
        var index = this.map.findIndex(element => element.key.x == x && element.key.y == y);
        if(index > 0) this.map[index] = value;
    }

    setCaseOfMap(x,y,value){
        var caseMap = this.getElementMap(x,y);
        caseMap.value.color = value.color;
        caseMap.value.type = value.type;
        caseMap.value.idPlayer = value.idPlayer;
        this.setElementMap(x,y,caseMap);
    }

    addSpawPlayer(player){
        var spawn = player.spawn;
        var caseMap = this.getElementMap(spawn.x,spawn.y);
        caseMap.value.type = Constants.TYPECASE.AREA;
        caseMap.value.idPlayer = player.id;
        caseMap.value.color = player.couleur;
        this.setElementMap(spawn.x,spawn.y,caseMap);
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
      //  console.log(x,y,xc,yc);
        return {x: xc, y: yc};
    }

    getRandomCaseMap(){
        var x = -1, y = -1;
        x = Math.floor(Math.random() * Math.floor(this.numberTile));
        y = Math.floor(Math.random() * Math.floor(this.numberTile));
        return {x: x, y: y};
    }

    getNbAreaPlayer(playerid){
        var tab = this.map.filter(element => this.isCaseAreaPlayer(element.key.x,element.key.y,playerid));
        return tab.length;
    }

    delCaseOf(playerID){
        var casePlayer = this.map.filter(element => element.value.idPlayer === playerID);
        var casePlayerPath = this.map.filter(element => element.value.path !== undefined && element.value.path.idPlayer === playerID);
        casePlayer.forEach((element) => {
            if(element.value.path != undefined){
                var val = {type: Constants.TYPECASE.PATH, idPlayer: element.value.path.idPlayer, color: element.value.path.color}
                this.setCaseOfMap(x,y,val);
                element.value.path = undefined;
            } else element.value = {type: Constants.TYPECASE.VIDE, x: element.value.x, y: element.value.y};
        });
        casePlayerPath.forEach((element) => { element.value.path = undefined; })
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
        var elem = this.getCaseOfXY(me.x,me.y);
        return this.map.filter(element => element.key.x >= elem.x - 10 && element.key.x <= elem.x + 10 && element.key.y >= elem.y - 10 && element.key.y <= elem.y + 10);
    }

    getMiniMap(){
        var result = [];
/*
        for(var i = 0; i < this.map.length; i++){
            var tab = this.map[i].filter((element) => { return element.type !== Constants.TYPECASE.AREA });
            result.push(tab);
        }*/
     /*   for(var y = 0; y < this.map.length; y++){
            var tab = [];
            for(var x = 0; x < this.map[y].length; x++){
                tab.push({
                    value: (this.map[y][x].type !== Constants.TYPECASE.AREA),
                    x: this.map[y][x].x,
                    y: this.map[y][x].y
                });
            }
            result.push(tab);
        }*/
        return result;
    }

    isCasePlayer(x,y,playerid){
        if(x >= this.numberTile) return true;
        if(y >= this.numberTile) return true;
        var elem = this.getElementMap(x,y);
        if(elem.value.type === Constants.TYPECASE.PATH && elem.value.idPlayer === playerid) return true
        if(elem.value.type === Constants.TYPECASE.AREA && elem.value.idPlayer === playerid) return true
        if(elem.value.type === Constants.TYPECASE.AREA && elem.value.idPlayer !== playerid){
            if(elem.value.path !== undefined && elem.value.path.idPlayer === playerid) return true
        }
        else return false;
    }

    isCasePathPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        return (elem.value.type == Constants.TYPECASE.PATH && elem.value.idPlayer === playerid);
    }

    isCaseAreaPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        return (elem.value.type == Constants.TYPECASE.AREA && elem.value.idPlayer === playerid);
    }

    isCasePathOtherPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        return (elem.value.type == Constants.TYPECASE.PATH && elem.value.idPlayer !== playerid);
    }

    isCaseAreaOtherPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        return (elem.value.type == Constants.TYPECASE.AREA && elem.value.idPlayer !== playerid);
    }

    isCaseEmpty(x,y){
        var elem = this.getElementMap(x,y);
       // console.log(x,y,elem)
        return (elem.value.type == Constants.TYPECASE.VIDE);
    }

    addPathOnArea(x,y,player){
        var elem = this.getElementMap(x,y);
        if(elem.value.type == Constants.TYPECASE.AREA) {
            elem.value.path = { idPlayer: player.id, type: Constants.TYPECASE.PATH, color: player.couleur};
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

    
        this.map.forEach((element) => {
            var { x , y } = element.key;
            var b = this.isCasePlayer(x,y,player.id);
            if(b){
                
                if(this.isCasePathPlayer(x,y,player.id)) this.setCaseOfMap(x,y,value);
                    else if(this.isCaseAreaOtherPlayer(x,y,player.id) && element.value.path != undefined){
                        this.setCaseOfMap(x,y,value);
                        element.value.path = undefined;
                }
                if(!this.isCasePlayer(x+1,y,player.id)) this.searchNextPathAreaX(x+1,y,player.id,tabX);
                if(!this.isCasePlayer(x,y+1,player.id)) this.searchNextPathAreaY(x,y+1,player.id,tabY);
            }
        })

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