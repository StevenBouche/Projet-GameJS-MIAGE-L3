// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
//import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

var instance = undefined;

class NetworkManager{

    constructor(onGameOver){
      this.state = {};
      this.socket = io(`ws://192.168.1.20:3000`, { reconnection: false });
      this.connectedPromise = new Promise(resolve => {
          this.socket.on('connect', () => { 
            console.log('Connected to server!');
             this.connect(onGameOver);
            resolve(); 
          });
        });
    }

    play(username){
      this.socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
    };

    updateInput(){
      throttle(20, dir => { this.socket.emit(Constants.MSG_TYPES.INPUT, dir);});
    };

    gameUpdate(update){
      this.state = update;
      console.log(this.state);
    }

    connect = onGameOver => (
      this.connectedPromise.then(() => {
      this.socket.on(Constants.MSG_TYPES.GAME_UPDATE, this.gameUpdate.bind(this));
       // socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
        this.socket.on('disconnect', () => {
          console.log('Disconnected from server.');
          document.getElementById('disconnect-modal').classList.remove('hidden');
          document.getElementById('reconnect-button').onclick = () => {
            window.location.reload();
          };
        });
      })
    );
    
    getCurrentState(){
      console.log("return this state "+this.state)
        return this.state;
    }

}

export default NetworkManager

/*
export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);
*/

