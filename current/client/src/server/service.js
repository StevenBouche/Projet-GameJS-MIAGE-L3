// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
const HashMapCase = require("../server/Entities/HashMapCase")
const Constants = require("../shared/constants")
const { workerData, parentPort, MessagePort, Worker, MessageChannel } = require('worker_threads')

var port = undefined;
var firstMessage = true;
var running = true;

var players= [];
var map = [];
let hashMap = undefined;

let tabWorker = [];
let processing = false;
let nbThread = 0;
let finishThread = 0;

var getCaseOfXY = (x,y) => {
  var xc = Math.floor(x/Constants.MAP_TILE);
  var yc = Math.floor(y/Constants.MAP_TILE);
  return {x: xc, y: yc};
}

var isIn = (element,x,y) => { return (element.content.x >= x - 16 && element.content.x <= x + 16 && element.content.y >= y - 8 && element.content.y <= y + 8); }

var getMapPlayer = () => {

  let sizeX = 10;
  let sizeY = 6;

    Object.keys(players).forEach(playerID => {
      let cpt = 0;
      var player = players[playerID],
          elem = getCaseOfXY(player.x,player.y),
          elementtab = [];
         
            let topLeftX = elem.x - sizeX;
            let topLeftY = elem.y - sizeY;
      
            if(topLeftX < 0) topLeftX = 0;
            if(topLeftY < 0) topLeftY = 0;
      /*
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
  setTimeout(getData,1000/20);

};

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

// TEST ///////////////////////////////////////////////////////////////


let handleProcessing = () => {
   finishThread++;
  if(finishThread == nbThread) {
   // console.log("Thread finish get data")
    processing = false;
    setTimeout(getData,1000/20);
  }
}

let createThreadPlayer= (data) => {

  if(processing != true) {
  
    let p = data.players;
    finishThread = 0;
    nbThread = Object.keys(p).length;

    if(nbThread > 0) {

      Object.keys(p).forEach( playerID => {
            let workerData = {
            player: p[playerID],
            map: data.map,
            hashmap: data.maptest
          };
      
      
          let worker = new Worker('./servicePlayer.js', { workerData });
          worker.on('message', (data) => { sendResult(data); handleProcessing();/*worker.terminate();*/})
          worker.on('error', (error) => {console.log("Error from thread "+playerID+" "+error); handleProcessing();} );
          worker.on('exit', (code) => {
            //  if (code !== 0) throw new Error(`Worker stopped with exit code ${code}`);
            handleProcessing();
        //   worker.terminate();
          })
      
          
      });
    } else {
      processing = false;
      setTimeout(getData,1000/20);
    }
    
 
  }

};





