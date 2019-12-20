import React, { Component } from 'react';
import NetworkManager from '../manager/NetworkManager'
import ViewManager from '../View/ViewManager'
import KeyboardListener from '../manager/KeyboardListener'
import StateGame from './state'
import GameState from '../stateView/GameState'
import GamePrediction from './GamePrediction'

export default class Game extends Component {

    state = {
        networkManager: undefined,
        viewManager: undefined,
        keyboardListener: undefined,
        stateGame: undefined,
        stateView: undefined,
        gamePrediction: undefined,
        interval: undefined
    }

    componentDidMount(){
       // this.setState({stateGame: new StateGame()});
        this.setState({networkManager: new NetworkManager(this)});  
        this.setState({viewManager: new ViewManager(this.assetHaveLoaded)}, () => {
            this.setState({stateView: new GameState(this.state.viewManager,this.startNetwork)});
        }); 
        this.setState({keyboardListener: new KeyboardListener()}, () => {
            this.state.keyboardListener.addObserver(this);
        });
        this.setState({gamePrediction: new GamePrediction()});
    }

    assetHaveLoaded = () => {
        this.state.stateView.nextState();
    }

    startNetwork = (userInput) => {
        this.state.networkManager.play({username: userInput, idskin: this.state.viewManager.skinIndex});
        this.setState({interval: setInterval(this.updateGame,1000/60)}); //remplacer par request animation frame
    }

    disconnectFromServer = () => {
        this.state.stateView.disconnect();
        clearInterval(this.state.interval);
        this.setState({interval: undefined});
    }

    connectFromServer = () => {
        this.state.stateView.connect();
    }

    onGameOver = () => {
        var {keyboardListener, stateView} = this.state;
        stateView.nextState();
        keyboardListener.resetInput();
        clearInterval(this.state.interval);
        this.setState({interval: undefined});
    }
     
    updateInput(data){
        this.state.networkManager.updateInput(data);
        this.state.gamePrediction.setDirectionUser(data.dir);
    }

    updateStateGame(state){
        this.state.gamePrediction.setCurrentPlayerFromServer(state.me,state.t);
        this.state.viewManager.currentGameState = state;
    }

    updateGame = () => {
        this.state.gamePrediction.update();
       // let time = this.state.gamePrediction.lastUpdateTime;
        let player = this.state.gamePrediction.getLastPrediction();
        //console.log(player)
        if(player != undefined){
            this.state.viewManager.render(player);
        }
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
                    <canvas id="skin" ></canvas>
                    <div className="selectPlayer" > 
                        <div> <button id="previousSkin">Previous skin</button></div>
                        <div><button id="nextSkin">Next skin</button></div>
                    </div>
                    
                    
                    <hr/>
                    <input type="text" id="username-input" placeholder="Username" />
                    <button id="play-button">Start game</button>
                </div>
                <div id="connexion-server" className="hidden">
                    <h1>Jeux de tuiles</h1>
                    <hr/>
                    <h3>Connection serveur ...</h3>
                    <div className="loader"></div>
                </div>
                <div id="load-server" className="hidden">
                    <h1>Jeux de tuiles</h1>
                    <hr/>
                    <h3>Load assets server ...</h3>
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
                <table id='leaderboardTable'>
                        <thead>
                            <tr>
                                <th>FPS</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
                <audio id="audioPlayer" src=""></audio>
            </div>
        );
    }


}