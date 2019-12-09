import React, { Component } from 'react';
import NetworkManager from '../network/NetworkManager'
import ViewManager from '../View/ViewManager'
import KeyboardListener from '../manager/KeyboardListener'
import StateGame from './../Model/state'

export default class Game extends Component {

    state = {
        networkManager: undefined,
        viewManager: undefined,
        keyboardListener: undefined,
        playbutton: undefined,
        usernameInput: undefined,
        playmenu: undefined,
        leaderboard: undefined,
        stateGame: undefined
    }

    componentDidMount(){
       // this.setState({stateGame: new StateGame()});
        this.setState({networkManager: new NetworkManager(this)});  
        this.setState({viewManager: new ViewManager()}, () => {
            this.state.viewManager.stopRendering();
        });
        this.setState({keyboardListener: new KeyboardListener()}, () => {
            this.state.keyboardListener.addObserver(this);
        });
        this.setState({
            playbutton: document.getElementById('play-button'),
            usernameInput: document.getElementById('username-input'),
            leaderboard: document.getElementById('leaderboard'),
            playmenu: document.getElementById('play-menu')
        }, () => {
            this.state.playbutton.onclick = () => {
                this.state.networkManager.play(this.state.usernameInput.value);
                this.state.viewManager.startRendering();
                this.setLeaderboardHidden(false);
                this.setPlaymenuHidden(true);
            };
        });
    }

    onGameOver = () => {
        var {viewManager, keyboardListener} = this.state;
        viewManager.stopRendering();
        keyboardListener.resetInput();
        this.setLeaderboardHidden(true);
        this.setPlaymenuHidden(false);
    }
     
    updateInput(data){
    //    this.state.stateGame.updateInput(data);
        this.state.networkManager.updateInput(data);
    }

    updateStateGame(state){
      //  this.state.stateGame.updateStateGame(state);
        this.state.viewManager.currentGameState = state;
    }

    setLeaderboardHidden = (bool) => {
        if(bool) this.state.leaderboard.classList.add('hidden');
        else this.state.leaderboard.classList.remove('hidden');
    }

    setPlaymenuHidden = (bool) => {
        if(bool) this.state.playmenu.classList.add('hidden');
        else this.state.playmenu.classList.remove('hidden');
    }

    render(){

        return (
            <div>
               <canvas id="game-canvas"></canvas>
               <div id="mini-map">
                    <canvas id="mini-map-canvas" ></canvas>
               </div>
                <div id="play-menu" className="hidden">
                    <h1>Jeux de tuiles</h1>
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
                <div id="fps" >
                   
                </div>
            </div>
        );
    }


}