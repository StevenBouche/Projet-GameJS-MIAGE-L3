import io from 'socket.io-client';
const Constants = require('../shared/constants');

class NetworkManager{

    constructor(onGameOver){

      this.socket = io(`ws://localhost:3000`, { reconnection: false });
      this.firstTimeServer = 0;
      this.gameStart = 0;
      this.state = {};
      this.timestampPing = undefined;
      this.latency = 0;
      
      document.getElementById('connexion-server').classList.remove('hidden');

      this.connectedPromise = new Promise(resolve => {
          this.socket.on('connect', () => { 
            document.getElementById('connexion-server').classList.add('hidden');
            document.getElementById('play-menu').classList.remove('hidden');
            this.connect(onGameOver);
            setInterval(this.ping.bind(this), 20000);
            resolve(); 
          });
      });
    }

    play(username){
      this.socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
    };

    updateInput(dir){
      this.socket.emit(Constants.MSG_TYPES.INPUT, dir);
    };

    ping(){
      this.timestampPing = Date.now();
      console.log(Constants.MSG_TYPES.PING)
      this.socket.emit(Constants.MSG_TYPES.PING,"test");
    }

    setPing(){
      var time = Date.now();
      console.log("Ping server (ms) :");
      console.log(time-this.timestampPing);
      this.latency = time-this.timestampPing
      this.timestampPing = undefined;
    }
/*
    currentServerTime() {
      return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
    }*/

    gameUpdate(update){
      this.state = update;
    }

    connect = onGameOver => (
      this.connectedPromise.then(() => {

      this.socket.on(Constants.MSG_TYPES.GAME_UPDATE, this.gameUpdate.bind(this));
      this.socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
      this.socket.on(Constants.MSG_TYPES.PONG, this.setPing.bind(this));

      this.socket.on('disconnect', () => {
          console.log('Disconnected from server.');
          document.getElementById('disconnect-modal').classList.remove('hidden');
          document.getElementById('reconnect-button').onclick = () => { window.location.reload(); };
        });
      })

    );

    getCurrentState(){
  //    console.log("return this state "+this.state)
        return this.state;
    }

}

export default NetworkManager
