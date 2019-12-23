import io from "socket.io-client";
const Constants = require("../shared/constants");

var port = process.env.GAME_PORT || 3001;
var ip = process.env.GAME_HOSTNAME || Constants.IP_SERVER


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
    this.ping = 0;
    this.majEcart = false;
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
              this.ping = Math.round((t2-t1)-(tp2-tp1));


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
      return Date.now() + this.ecart;
  }

  play(username) {
    username.t = Date.now();
    this.socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
  }

  updateInput(dir) {
    dir.t = this.currentServerTime();
    dir.timeclient = Date.now();
    this.majEcart = true;
    this.socket.emit(Constants.MSG_TYPES.INPUT, dir);
  }

  ping = () => {
    this.timestampPing = Date.now();
   // console.log(Constants.MSG_TYPES.PING);
    this.socket.emit(Constants.MSG_TYPES.PING, "test");
  }

  setPing = () => {
    var time = Date.now();
    this.latency = time - this.timestampPing;
    this.timestampPing = undefined;
  }
 
  gameUpdate = update => {

    if(this.majEcart === true){
      let tp1 = update.playertime.rt;
      let t1 = update.playertime.ot;
      let t2 = Date.now();
      let tp2 = update.playertime.tt;
      this.ecart = Math.round((tp1+tp2)/2 - (t1+t2)/2);
      this.ping = Math.round((t2-t1)-(tp2-tp1))/2;
      this.majEcart = false;
    }
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
