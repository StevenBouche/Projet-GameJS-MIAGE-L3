//const Map = require('./Map');
const Matrice = require('./Matrice')
const Player = require('./player');
const {TYPECASE, MSG_TYPES, MAP_SIZE} = require('../../shared/constants');
var equal = require('deep-equal');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.map = new Matrice();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    var caseM = this.map.getRandomCaseMap(); // x & y  Generate a position to start this player at.

    //TODO CONDITION DE SORTIE
    while (!this.map.isCaseEmpty(caseM.x, caseM.y)){
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
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) this.players[socket.id].updateState(dir);
  }

  update = () => { 
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      if(player != undefined){
        player.update(dt);
        var res = this.map.getCaseOfXY(player.x,player.y);

        var b = player.setCurrentCase(res);
        //NEW CASE
        if(b) {
          var value = {type: TYPECASE.PATH, idPlayer: playerID, color: player.couleur};
          var elem = this.map.getElementMap(res.x,res.y);
          //si je retourne sur mon path je meurt
          if(this.map.isCasePathPlayer(res.x,res.y,player.id)) this.playerDie(player.id);
          //si je tombe sur une case vide devient mon path
          else if (this.map.isCaseEmpty(res.x,res.y)) this.map.setCaseOfMap(res.x,res.y,value);
          //si c'est une case area a moi je regarde pour construire et tue si un joueur a un path dessus
          else if (this.map.isCaseAreaPlayer(res.x,res.y,player.id)) {
              if(elem.value.path != undefined) this.playerDie(elem.value.path.idPlayer);
              this.map.pathToArea(player);
          }
          // si case area autre joueur j'add mon path sur son area 
          else if (this.map.isCaseAreaOtherPlayer(res.x,res.y,player.id)) {
            if(elem.value.path != undefined && elem.value.path.idPlayer == player.id) this.playerDie(player.id);
            else this.map.addPathOnArea(res.x,res.y,player);
          }
          //si c'est un chemin d'un autre joueur il meurt et devient mon path
          else if(this.map.isCasePathOtherPlayer(res.x,res.y,player.id)){
            this.playerDie(elem.value.idPlayer);
            this.map.setCaseOfMap(res.x,res.y,value);
          } 
        }
        if (this.players[playerID] != undefined) {
         /* if(this.players[playerID].score == 0){
            this.playerDie(playerID);
          }*/
          this.players[playerID].score = this.map.getNbAreaPlayer(playerID);
        }
      }
    });

    const leaderboard = this.getLeaderboard();
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      socket.emit(MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
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
      map: this.map.getMapPlayer(player.serializeForUpdate()),
      miniMap: this.map.getMiniMap(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
