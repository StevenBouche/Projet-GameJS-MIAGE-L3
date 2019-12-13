const { parentPort, workerData } = require('worker_threads');
const HashMapCase = require("../server/Entities/HashMapCase");
const Constants = require("../shared/constants");

let getCaseOfXY = (x,y) => {
  let xc = Math.floor(x/Constants.MAP_TILE);
  let yc = Math.floor(y/Constants.MAP_TILE);
  return {x: xc, y: yc};
}

let isIn = (element,x,y) => { return (element.content.x >= x - 16 && element.content.x <= x + 16 && element.content.y >= y - 8 && element.content.y <= y + 8); }

let traitement = () => {
   // console.log(workerData)
    let { player, map, hashmap } = workerData;
    let hashMap = Object.create(HashMapCase.prototype, Object.getOwnPropertyDescriptors(hashmap));

    let cpt = 0;
    let elem = getCaseOfXY(player.x,player.y);
    let elementtab = [];
    /*
    let topLeftX = elem.x - sizeX, topLeftY = elem.y - sizeY;

    if(topLeftX < 0) topLeftX = 0;
    if(topLeftY < 0) topLeftY = 0;

    for(let y = topLeftY; y < topLeftY + 2 * sizeY; y++){
        for(let x = topLeftX; x < topLeftX + 2 * sizeX; x++){
            let res = hashMap.get({x:x,y:y});
        // console.log(res)
            if(res != undefined){
            elementtab.push(res);
            cpt++;
            }
        }
    }*/

    for(var i = 0; i < map.length; i++){
        let element = map[i];
        let res = hashMap.get(element.content);
        if( isIn(element,elem.x,elem.y)) elementtab.push(res);  
        if(res.type === Constants.TYPECASE.AREA && res.idPlayer === player.id) cpt++;
    }
    
    let result = {map: elementtab, id: player.id, score: cpt}
    parentPort.postMessage(result);
   // exit(1);
}

traitement();