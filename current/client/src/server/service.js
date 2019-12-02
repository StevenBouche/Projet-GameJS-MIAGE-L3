// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
const HashMapCase = require("../server/Entities/HashMapCase")
const Constants = require("../shared/constants")
const { workerData, parentPort, MessagePort } = require('worker_threads')

var port = undefined;
var firstMessage = true;
var running = true;

var players= [];
var map = [];
let hashMap = undefined;

var getCaseOfXY = (x,y) => {
  var xc = Math.floor(x/Constants.MAP_TILE);
  var yc = Math.floor(y/Constants.MAP_TILE);
  return {x: xc, y: yc};
}

var isIn = (element,x,y) => { return (element.content.x >= x - 15 && element.content.x <= x + 15 && element.content.y >= y - 8 && element.content.y <= y + 8); }

var getMapPlayer = () => {
    Object.keys(players).forEach(playerID => {
      let cpt = 0;
      var player = players[playerID],
          elem = getCaseOfXY(player.x,player.y),
          elementtab = [];
      for(var i = 0; i < map.length; i++){
        var element = map[i];
        let res = hashMap.get(element.content);
        if( isIn(element,elem.x,elem.y)) elementtab.push(res);  

        if(res.type === Constants.TYPECASE.AREA && res.idPlayer === playerID) cpt++;
      }
      sendResult({map: elementtab, id: playerID, score: cpt});
    });
}

var sendResult = (result) => { parentPort.postMessage(result); }
var getData = () => { port.postMessage("Worker get data"); }

var loopCalcul = (data) => {
  players = data.players;
  map = data.map;
  //console.log(data)
  hashMap = Object.create(HashMapCase.prototype, Object.getOwnPropertyDescriptors(data.maptest));

  getMapPlayer();
  setTimeout(getData,1000/30);
}

parentPort.on('message', (e) => {
  //TODO ELSE
    if(firstMessage) {
      port = e.port;
      firstMessage = false;
      port.on('message',(data) => { loopCalcul(data); });
      getData();
    } else {
      parentPort.close();
    }
});






