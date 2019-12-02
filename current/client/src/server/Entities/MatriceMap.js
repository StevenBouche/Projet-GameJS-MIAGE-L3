const Constants = require('../../shared/constants');
const equal = require('deep-equal');
const HashMapCase = require('./HashMapCase');

module.exports = class MatriceMap {

    constructor(){
        this.numberTile = Constants.MAP_SIZE / Constants.MAP_TILE;
        this.hashMap = new HashMapCase(this.numberTile*this.numberTile);
    }

    setCaseOfMap(x,y,value){
        //TODO a revoir
        var xy = this.getXYCenterfromCase(x,y);
        let v = value;
        v.x = xy.x;
        v.y = xy.y;
        this.hashMap.set({x:x,y:y},v)
    }

    getElementMap(x,y){
        return this.hashMap.get({x:x,y:y});
    }

    addSpawPlayer(player){
        var spawn = player.spawn;
        let value = {
            type: Constants.TYPECASE.AREA,
            idPlayer: player.id,
            color: player.couleur
        }
        this.setCaseOfMap(spawn.x,spawn.y,value);
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
        return {x: x, y: y};
    }
/*
    getNbAreaPlayer(player){
        this.hashMap.buckets.forEach((element) => {
            if(element.value.type == Constants.TYPECASE.AREA) player[element.value.idPlayer].score += 1;
        });
    }
*/
    delCaseOf(playerID){
        //TODO ASYNC ?
        let tab = Array.from(this.hashMap.keys);

        tab.forEach((key) => {
            let { x , y } = key.content;
            let element = this.getElementMap(x,y);
            if(element != undefined) {

                if( // TODO Simplification condition
                    (element.type === Constants.TYPECASE.PATH && element.idPlayer === playerID) ||
                    (element.type === Constants.TYPECASE.AREA && element.idPlayer === playerID && element.path === undefined)) {
                    this.hashMap.delete(key.content);      
                }
                else if( 
                    element.type === Constants.TYPECASE.AREA && 
                    element.path !== undefined && 
                    element.path.idPlayer === playerID){
                        element.path = undefined; 
                        this.setCaseOfMap(x,y,element);
                }
                else if (
                    element.type === Constants.TYPECASE.AREA &&
                    element.idPlayer === playerID && 
                    element.path !== undefined
                ){
                    this.setCaseOfMap(x,y,element.path);
                }
/*
                else if(element.type === Constants.TYPECASE.AREA){
                    console.log("AREA")
                    console.log(element.idPlayer,playerID)
                    if(element.idPlayer == playerID) {
                        if(element.path === undefined) {
                            console.log("delete")
                            
                            this.hashMap.delete(key.content);
                            console.log(key.content)
                           
                        }
                        else this.setCaseOfMap(x,y,element.path);
                    }
                    else if(element.path != undefined && element.path.idPlayer === playerID)  element.path = undefined; this.setCaseOfMap(x,y,element);
                } */
            }
        })

 

/*
        var casePlayer = this.hashMap.buckets.filter(element => element.idPlayer === playerID);
        var casePlayerPath = this.hashMap.buckets.filter(element => element.path !== undefined && element.path.idPlayer === playerID);
        casePlayer.forEach((element) => {
            if(element.path != undefined){
                var val = {type: Constants.TYPECASE.PATH, idPlayer: element.path.idPlayer, color: element.path.color}
                this.setCaseOfMap(x,y,val);
                element.path = undefined;
            } else element = {type: Constants.TYPECASE.VIDE, x: element.x, y: element.y};
        });
        casePlayerPath.forEach((element) => { element.path = undefined; })*/
    }

    searchNextPathAreaX(x,y,playerid,tab){
        if(x >= this.numberTile) return null;
        else if(this.isCasePlayer(x,y,playerid)) return tab;
        else {
            var res = this.searchNextPathAreaX(x+1,y,playerid,tab);
            if(res != null) { tab.push({x: x, y: y}); return tab;
            } else return null; 
        }
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

    isIn(element,x,y){
        //TODO A REVOIR
        var elem = this.getCaseOfXY(x,y);
        var casePlayer = this.getCaseOfXY(element.x,element.y);
        return (casePlayer.x >= elem.x - 15 && casePlayer.x <= elem.x + 15 && casePlayer.y >= elem.y - 8 && casePlayer.y <= elem.y + 8);
    }

    getMapPlayer(me){    
      var elementtab = [];
      this.hashMap.keys.forEach((key) => {
        var {x, y} = key.content;
        let element = this.getElementMap(x,y);
        if(element != undefined && this.isIn(element,me.x,me.y)) elementtab.push(element);  
      })
      return elementtab;
    }
   /*
    getMiniMap(){
        return  this.hashMap.buckets.filter(element => element.value.type == Constants.TYPECASE.AREA);
    }*/

    isCasePlayer(x,y,playerid){
        if(x >= this.numberTile) return true;
        if(y >= this.numberTile) return true;
        var elem = this.getElementMap(x,y);
        if(elem == undefined) return false;
        if(elem.type === Constants.TYPECASE.PATH && elem.idPlayer === playerid) return true
        if(elem.type === Constants.TYPECASE.AREA && elem.idPlayer === playerid) return true
        if(elem.type === Constants.TYPECASE.AREA && elem.idPlayer !== playerid){
            if(elem.path !== undefined && elem.path.idPlayer === playerid) return true
        }
        else return false;
    }

    isCasePathPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        if(elem == undefined) return false;
        return (elem.type == Constants.TYPECASE.PATH && elem.idPlayer === playerid);
    }

    isCasePathPlayerElem(elem,playerid){
        return (elem.type == Constants.TYPECASE.PATH && elem.idPlayer === playerid);
    }

    isCaseAreaPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        if(elem == undefined) return false;
        return (elem.type == Constants.TYPECASE.AREA && elem.idPlayer === playerid);
    }

    isCaseAreaPlayerElem(elem,playerid){
        return (elem.type == Constants.TYPECASE.AREA && elem.idPlayer === playerid);
    }

    isCasePathOtherPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        if(elem == undefined) return false;
        return (elem.type == Constants.TYPECASE.PATH && elem.idPlayer !== playerid);
    }

    isCaseAreaOtherPlayer(x,y,playerid){
        var elem = this.getElementMap(x,y);
        if(elem == undefined) return false;
        return (elem.type == Constants.TYPECASE.AREA && elem.idPlayer !== playerid);
    }

    isCaseAreaOtherPlayerElem(elem,playerid){
        return (elem.type == Constants.TYPECASE.AREA && elem.idPlayer !== playerid);
    }

    isCaseEmpty(x,y){
        var elem = this.getElementMap(x,y);
        return (elem == undefined);
    }

    addPathOnArea(x,y,player){
        var elem = this.getElementMap(x,y);
        if(elem.type == Constants.TYPECASE.AREA) {
            elem.path = { idPlayer: player.id, type: Constants.TYPECASE.PATH, color: player.couleur};
        }
    }

    pathToArea(player){
        var tabX = new Array();
        var tabY = new Array();

        this.hashMap.keys.forEach((key) => {

            var value = {
                color: player.couleur,
                type: Constants.TYPECASE.AREA,
                idPlayer: player.id
            };

            var { x , y } = key.content;
            let element = this.getElementMap(x,y);
            var b = this.isCasePlayer(x,y,player.id);
            if(b){
                if(this.isCasePathPlayer(x,y,player.id)) this.setCaseOfMap(x,y,value);
                else if(this.isCaseAreaOtherPlayer(x,y,player.id) && element.path != undefined){
                    this.setCaseOfMap(x,y,value);
                    //element.path = undefined;
                }
                if(!this.isCasePlayer(x+1,y,player.id)) this.searchNextPathAreaX(x+1,y,player.id,tabX);
                if(!this.isCasePlayer(x,y+1,player.id)) this.searchNextPathAreaY(x,y+1,player.id,tabY);
            }
        })

        var elem = {};
        var i;
       for(i = 0; i < tabX.length; i++){

        var value = {
            color: player.couleur,
            type: Constants.TYPECASE.AREA,
            idPlayer: player.id
        };

           elem = tabY.find((element) => {return element.x == tabX[i].x && element.y == tabX[i].y});
           if(elem != undefined) this.setCaseOfMap(tabX[i].x,tabX[i].y,value);
       }

       for(i = 0; i < tabY.length; i++){

        var value = {
            color: player.couleur,
            type: Constants.TYPECASE.AREA,
            idPlayer: player.id
        };

            elem = tabX.find((element) => {return element.x == tabY[i].x && element.y == tabY[i].y});
            if(elem != undefined) this.setCaseOfMap(tabY[i].x,tabY[i].y,value);
            
        }

        
    }

}