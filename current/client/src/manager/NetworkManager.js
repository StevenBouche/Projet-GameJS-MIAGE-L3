import io from "socket.io-client";
const Constants = require("../shared/constants");

var port = process.env.GAME_PORT || 3001;
var ip = process.env.GAME_HOSTNAME || "localhost"


class NetworkManager {
  constructor(game) {
    this.socket = io(`ws://${ip}:${port}`, { reconnection: false });
    this.state = {};
    this.timestampPing = undefined;
    this.latency = 0;
    this.game = game;
    this.firstServerTimestamp = 0;
    this.gameStart = 0;
    this.ecart = 0;
    document.getElementById("connexion-server").classList.remove("hidden");
   
    this.connectedPromise = new Promise(resolve => {
      this.socket.on("connect", () => {
        console.log("connect")
          this.socket.on('ntpsyncclient', (data) => {
         //   console.log('receive ntp from server')
              let t2 = Date.now();
              let tp1 = data.rt;
              let tp2 = data.tt;
              let t1 = data.ot;
              this.ecart = Math.round((tp1+tp2)/2 - (t1+t2)/2);
            //  console.log(ecart)

              //RT  T'1
              //TT  T'2
              //OT  T1

              this.game.connectFromServer();
              this.connect(game.onGameOver);
              //setInterval(this.ping, 20000);
              resolve();

          })
          this.socket.emit('ntpsync', {tt:Date.now()});
      });
    });
  }

  currentServerTime() {
    console.log(this.ecart)
      return Date.now() + this.ecart;
  //  return this.firstServerTimestamp + (Date.now() - this.gameStart) +10  ;
  }

  play(username) {
    this.socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
  }

  updateInput(dir) {

    console.log("dirt : "+dir.t)
    dir.t = this.currentServerTime();
    console.log("dirt : "+dir.t)
    this.socket.emit(Constants.MSG_TYPES.INPUT, dir/*, timestamp*/);
    
  }

  ping = () => {
    this.timestampPing = Date.now();
    console.log(Constants.MSG_TYPES.PING);
    this.socket.emit(Constants.MSG_TYPES.PING, "test");
  }

  setPing = () => {
    var time = Date.now();
    console.log("Ping server (ms) :");
    console.log(time - this.timestampPing);
    this.latency = time - this.timestampPing;
    this.timestampPing = undefined;
  }
 
  gameUpdate = update => {
    if (!this.firstServerTimestamp) {
      this.firstServerTimestamp = update.t;
      this.gameStart = Date.now();
    }
    this.game.updateStateGame(update);
   // this.state = update;
  }

  connect = onGameOver =>
    this.connectedPromise.then(() => {
      this.socket.on( Constants.MSG_TYPES.GAME_UPDATE, this.gameUpdate);
      this.socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
      this.socket.on(Constants.MSG_TYPES.PONG, this.setPing);

      this.socket.on("disconnect", () => {
        this.game.disconnectFromServer();
      });
    });

  getCurrentState() {
    //    console.log("return this state "+this.state)
    return this.state;
  }
}

export default NetworkManager;
