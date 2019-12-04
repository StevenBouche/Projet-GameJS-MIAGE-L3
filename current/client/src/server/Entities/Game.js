const Matrice = require('./Matrice');
const MatriceMap = require('./MatriceMap')
const Player = require('./player');
const {TYPECASE, MSG_TYPES, MAP_SIZE, UI_REFRESH_HZ} = require('../../shared/constants');
var equal = require('deep-equal');
const { Worker, MessageChannel } = require('worker_threads')

const runServiceMapPlayer = (workerData,game) => {
    const { port1, port2 } = new MessageChannel();
    port1.on('message', (result) => { port1.postMessage({players: game.players, map: game.map.hashMap.keys}); });
    const worker = new Worker('./service.js', { workerData });
    worker.on('message', (data) => {game.setMapPlayer(data)});
    worker.on('error', (error) => {console.log("Error from thread "+error)});
    worker.on('exit', (code) => {
      if (code !== 0) throw new Error(`Worker stopped with exit code ${code}`);
      worker.terminate();
    })
    worker.postMessage({port: port2},[port2]);
}

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.map = new MatriceMap();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.mapAreaHaveChange = false;
    this.minimap = undefined; 
    this.runServiceMapPlayer({});
  }

  runServiceMapPlayer = (workerData) => {

    const { port1, port2 } = new MessageChannel();
    const worker = new Worker('./service.js', { workerData });

    port1.on('message', (result) => { port1.postMessage({players: this.players, map: this.map.hashMap.keys, maptest: this.map.hashMap}); });
    worker.on('message', (data) => { this.setMapPlayer(data)});
    worker.on('error', (error) => {console.log("Error from thread "+error)});
    worker.on('exit', (code) => {
      if (code !== 0) throw new Error(`Worker stopped with exit code ${code}`);
      worker.terminate();
    })
    worker.postMessage({port: port2},[port2]);
  }

  setMapPlayer = (tabmap) => {
    var { id, map, score} = tabmap;
   // console.log(score)
    if(id != undefined && this.players[id] != undefined){
      this.players[id].map = map;
      this.players[id].score = score;
    } 
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    var caseM = this.map.getRandomCaseMap(); // x & y  Generate a position to start this player at.
    while (!this.map.isCaseEmpty(caseM.x, caseM.y)){ //TODO CONDITION DE SORTIE
      caseM = this.map.getRandomCaseMap();
    }
    const xy = this.map.getXYCenterfromCase(caseM.x,caseM.y);
    this.players[socket.id] = new Player(socket.id, username, xy.x, xy.y,caseM.x,caseM.y);
    this.map.addSpawPlayer(this.players[socket.id]);
  }

  removePlayer(id) {
    delete this.sockets[id];
    delete this.players[id];
  }

  playerDie(playerID){
    const socket = this.sockets[playerID];
    this.map.delCaseOf(playerID);
    try{ socket.emit(MSG_TYPES.GAME_OVER); } catch(error){ console.log(error)}
    this.removePlayer(playerID);
    this.mapAreaHaveChange = true;
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) this.players[socket.id].updateState(dir);
  }

  actionEmpty = (player,x,y,value) => {
    this.map.setCaseOfMap(x,y,value);
    player.setLastArea(false);
  }

  actionPath = (elem,player,x,y,value) => {
    if(elem.idPlayer == player.id) this.playerDie(player.id);
    else { this.playerDie(elem.idPlayer); this.map.setCaseOfMap(x,y,value);}
    player.setLastArea(false);
  }

  actionArea = (elem,player,x,y) => {
    if(elem.path != undefined) this.playerDie(elem.path.idPlayer);
    if(elem.idPlayer == player.id) {
      if(!player.lastCaseArea) {
        this.map.pathToArea(player);
        player.setLastArea(true);
        this.mapAreaHaveChange = true;
     //   this.map.getNbAreaPlayer(this.players);
      }
    }
    else this.map.addPathOnArea(x,y,player);
  }

  update = () => { 

    //DeltaTime
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    Object.keys(this.sockets).forEach(playerID => { // update des joueurs
      const player = this.players[playerID];
      if(player != undefined){
        player.update(dt);
        var res = this.map.getCaseOfXY(player.x,player.y);
        var b = player.setCurrentCase(res);
        
        if(b) { // Joueur est dans une nouvelle case
          var value = {type: TYPECASE.PATH, idPlayer: playerID, color: player.couleur};
          var elem = this.map.getElementMap(res.x,res.y);
          if(elem == undefined) this.actionEmpty(player,res.x,res.y,value);
          else {
            switch (elem.type) {
             // case TYPECASE.VIDE: this.actionEmpty(player,res.x,res.y,value); break;
              case TYPECASE.PATH: this.actionPath(elem,player,res.x,res.y,value); break;
              case TYPECASE.AREA: this.actionArea(elem,player,res.x,res.y); break;
              default: break;
            }
          }
        }
      }
    });

    const leaderboard = this.getLeaderboard();
    
//    if(this.mapAreaHaveChange) this.minimap = this.map.getMiniMap();
    const minimap = this.minimap;
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      var element = this.createUpdate(player, leaderboard);
      element.miniMap = minimap;
      socket.emit(MSG_TYPES.GAME_UPDATE, element);
    });
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= MAP_SIZE,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      map: /*this.map.getMapPlayer(player.serializeForUpdate()),*/player.map,
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
