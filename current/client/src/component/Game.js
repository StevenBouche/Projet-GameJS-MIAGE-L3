import React, { Component } from 'react';
//Import Manager
import NetworkManager from '../network/NetworkManager'
import ViewManager from '../View/ViewManager'
import KeyboardListener from '../manager/KeyboardListener'

var equal = require('deep-equal');


export default class Game extends Component{

    state = {
        networkManager: undefined,
        viewManager: undefined,
        keyboardListener: undefined
    }

    componentDidMount(){
       this.setState({networkManager: new NetworkManager(this.onGameOver.bind(this))}, () => {
           this.setState({viewManager: new ViewManager(this.state.networkManager)}, () => {
               this.state.viewManager.startRendering();
           });
       });  

       this.setState({keyboardListener: new KeyboardListener()}, () => {
            this.state.keyboardListener.addObserver(this);
       });

    }

    componentDidUpdate(){
       
    }

    onGameOver() {
         //stopCapturingInput();
         console.log("GAMEOVER")
         this.state.viewManager.stopRendering();
       //  playMenu.classList.remove('hidden');
       //  setLeaderboardHidden(true);
    }
     
    updateInput(data){
        console.log(data)
        this.state.networkManager.updateInput(data);
    }

    render(){

        // class="hidden" to play menu

        return (
            <div>
               <canvas id="game-canvas"></canvas>
                <div id="play-menu">
                    <h1>.io Game</h1>
                    <hr/>
                    <input type="text" id="username-input" placeholder="Username" />
                    <button id="play-button">PLAY</button>
                </div>
                <div id="leaderboard" className="hidden">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td></td><td></td></tr>
                            <tr><td></td><td></td></tr>
                            <tr><td></td><td></td></tr>
                            <tr><td></td><td></td></tr>
                            <tr><td></td><td></td></tr>
                        </tbody>
                    </table>
                </div>
                <div id="disconnect-modal" className="hidden">
                    <div>
                    <h2>Disconnected from Server </h2>
                    <hr />
                    <button id="reconnect-button">RECONNECT</button>
                    </div>
                </div>
            </div>
        );
    }


}