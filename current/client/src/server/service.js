// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

const Constants = require("../shared/constants")
const { workerData, parentPort, MessagePort } = require('worker_threads')

var port = undefined;
var firstMessage = true;
var running = true;

var players= [];
var map = [];

var getCaseOfXY = (x,y) => {
  var xc = Math.floor(x/Constants.MAP_TILE);
  var yc = Math.floor(y/Constants.MAP_TILE);
  return {x: xc, y: yc};
}

var isIn = (element,x,y) => { return (element.key.x >= x - 15 && element.key.x <= x + 15 && element.key.y >= y - 8 && element.key.y <= y + 8); }

var getMapPlayer = () => {
    Object.keys(players).forEach(playerID => {
      var player = players[playerID],
          elem = getCaseOfXY(player.x,player.y),
          elementtab = [];
      for(var i = 0; i < map.length; i++){
        var element = map[i];
        if( element.value.type != Constants.TYPECASE.VIDE && isIn(element,elem.x,elem.y)) elementtab.push(element);     
      }
      sendResult({map: elementtab, id: playerID});
    });
}

var sendResult = (result) => { parentPort.postMessage(result); }
var getData = () => { port.postMessage("Worker get data"); }

var loopCalcul = (data) => {
  players = data.players;
  map = data.map;
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






