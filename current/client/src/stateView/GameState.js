
const setLeaderboardHidden = (bool,leaderboard) => {
    if(bool) leaderboard.classList.add('hidden');
    else leaderboard.classList.remove('hidden');
}

const setPlaymenuHidden = (bool,playmenu) => {
    if(bool) playmenu.classList.add('hidden');
    else playmenu.classList.remove('hidden');
}

const setFPSHidden = (bool, fpsdiv) => {
    if(bool) fpsdiv.classList.add('hidden');
    else fpsdiv.classList.remove('hidden');
}

const setMiniMapHidden = (bool, miniMap) => {
    if(bool) miniMap.classList.add('hidden');
    else miniMap.classList.remove('hidden');
}

class initGame{

    start = (gameState) => {
        console.log("init game")
        gameState.audio.pause();
        gameState.viewManager.stopRendering();
        setLeaderboardHidden(true,gameState.leaderboard);
        setPlaymenuHidden(false,gameState.playmenu);
        setFPSHidden(true,gameState.fpsdiv);
        setMiniMapHidden(true,gameState.miniMap);
        document.getElementById("connexion-server").classList.add("hidden");
    }

    next = () => {
        return new startGame();
    }
}


class startGame{

     start = (gameState) => {
       // gameState.audio.play();
        gameState.viewManager.startRendering();
        setLeaderboardHidden(false,gameState.leaderboard);
        setPlaymenuHidden(true,gameState.playmenu);
        setFPSHidden(false,gameState.fpsdiv);
        setMiniMapHidden(false,gameState.miniMap);
    }

    next = () => {
        return new initGame();
    }
}

class disconnectState {

    start = (gameState) => {
        // gameState.audio.play();
         gameState.viewManager.stopRendering();
         setLeaderboardHidden(true,gameState.leaderboard);
         setPlaymenuHidden(true,gameState.playmenu);
         setFPSHidden(true,gameState.fpsdiv);
         setMiniMapHidden(true,gameState.miniMap);
         this.disconnect();
     }
 
     next = () => {
         return new connectState();
     }

     disconnect = () => {
        console.log("Disconnected from server.");
        document.getElementById("disconnect-modal").classList.remove("hidden");
        document.getElementById("reconnect-button").onclick = () => { window.location.reload();};
     }
}

class connectState {
    
    start = (gameState) => {
        // gameState.audio.play();
         gameState.viewManager.stopRendering();
         setLeaderboardHidden(true,gameState.leaderboard);
         setPlaymenuHidden(true,gameState.playmenu);
         setFPSHidden(true,gameState.fpsdiv);
         setMiniMapHidden(true,gameState.miniMap);
         document.getElementById("connexion-server").classList.remove("hidden");
     }
 
     next = () => {
         return new initGame();
     }


}

export default class GameState {

    constructor(viewManager,callbackPlay){

        this.state = new connectState();
        this.viewManager = viewManager;
        
        this.playbutton = document.getElementById('play-button');
        this.usernameInput = document.getElementById('username-input');
        this.leaderboard = document.getElementById('leaderboard');
        this.playmenu = document.getElementById('play-menu');
        this.fpsdiv = document.getElementById('fps');
        this.miniMap = document.getElementById('mini-map');

        this.audio = new Audio("bimbam.mp3");
        //this.audio = document.getElementById('audioPlayer');

        this.state.start(this)
        this.playbutton.onclick = () => { 
            callbackPlay(this.usernameInput.value);
            this.nextState(); 
        };
        
        
    }

    nextState = () => {
        this.state = this.state.next();
        this.start();
    }

    start = () => {
        this.state.start(this);
    }

    disconnect = () => {
        this.state = new disconnectState();
        this.start();
    }

    connect = () => {
        this.nextState();
    }


}