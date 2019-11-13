import React, { Component } from 'react';
import NetworkManager from '../network/NetworkManager'
import ViewManager from '../View/ViewManager'
import KeyboardListener from '../manager/KeyboardListener'

export default class Game extends Component {

    state = {
        networkManager: undefined,
        viewManager: undefined,
        keyboardListener: undefined
    }

    componentDidMount(){
       this.setState({networkManager: new NetworkManager(this.onGameOver)}, () => {
           this.setState({viewManager: new ViewManager(this.state.networkManager)}, () => {
               this.state.viewManager.startRendering();
           });
       });  

       this.setState({keyboardListener: new KeyboardListener()}, () => {
            this.state.keyboardListener.addObserver(this);
       });

    }

    onGameOver = () => {
         //stopCapturingInput();
         console.log("GAMEOVER")
         var {viewManager, keyboardListener} = this.state;
         viewManager.stopRendering();
         keyboardListener.resetInput();
       //  playMenu.classList.remove('hidden');
       //  setLeaderboardHidden(true);
    }
     
    updateInput(data){
        console.log(data)
        this.state.networkManager.updateInput(data);
    }

    render(){

        return (
            <div>
               <canvas id="game-canvas"></canvas>
                <div id="play-menu" className="hidden">
                    <h1>.io Game</h1>
                    <hr/>
                    <input type="text" id="username-input" placeholder="Username" />
                    <button id="play-button">PLAY</button>
                </div>
                <div id="connexion-server" className="hidden">
                    <h1>.io Game</h1>
                    <hr/>
                    <h3>Connection serveur ...</h3>
                    <div className="loader"></div>
                </div>
                <div id="leaderboard" className="hidden">
                    <table id='leaderboardTable'>
                        <thead>
                            <tr>
                                <th>Rank</th>
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