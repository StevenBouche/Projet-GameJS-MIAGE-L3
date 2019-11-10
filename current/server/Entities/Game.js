const Map = require('./Map');
const Player = require('./player');
//const applyCollisions = require('./collisions');
const Constants = require('../shared/constants');
var equal = require('deep-equal');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.map = new Map();
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    var caseM = this.map.getRandomCaseMap();
    const xy = this.map.getXYCenterfromCase(caseM.x,caseM.y);
    this.players[socket.id] = new Player(socket.id, username, xy.x, xy.y,caseM.x,caseM.y);
    this.map.addSpawPlayer(this.players[socket.id]);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  playerDie(playerID){
    const player = this.players[playerID];
    const socket = this.sockets[playerID];
    this.map.delCaseOf(playerID);
    socket.emit(Constants.MSG_TYPES.GAME_OVER);
    this.removePlayer(socket);
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
     // this.players[socket.id].setDirection(dir);
      this.players[socket.id].updateState(dir);
    }
  }

  update() { 
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const socket = this.sockets[playerID];
      if(player != undefined){
        player.update(dt);
        var res = this.map.getCaseOfXY(player.x,player.y);

        var b = player.setCurrentCase(res);
        //NEW CASE
        if(b) {

        var value = {type: Constants.TYPECASE.PATH, idPlayer: playerID, color: player.couleur};

          if(this.map.isCasePathPlayer(res.x,res.y,player.id)) this.playerDie(player.id);
          else if(this.map.isCasePathOtherPlayer(res.x,res.y,player.id)){
            this.playerDie(this.map.map[res.y][res.x].idPlayer);
            this.map.setCaseOfMap(res.x,res.y,value);
          } else if (this.map.isCaseEmpty(res.x,res.y)) this.map.setCaseOfMap(res.x,res.y,value);
          else if (this.map.isCaseAreaPlayer(res.x,res.y,player.id)) this.map.pathToArea(player); // TODO NEXT
          else if (equal(this.map.map[res.y][res.x].type,Constants.TYPECASE.AREA) && this.map.map[res.y][res.x].idPlayer != player.id){
           
          }
        }
      }
      
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE,
    );
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      map: this.map.map,
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
