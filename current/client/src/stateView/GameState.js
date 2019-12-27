
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
        console.log("before game")
        gameState.viewManager.stopRendering();
        setPlaymenuHidden(false,gameState.playmenu);
    }

    next = (gameState) => {
        setPlaymenuHidden(true,gameState.playmenu);
        return new startGame();
    }
}


class startGame{
    
     start = (gameState) => {
        console.log("in game")
        gameState.viewManager.startRendering();
        setLeaderboardHidden(false,gameState.leaderboard);
        setFPSHidden(false,gameState.fpsdiv);
        setMiniMapHidden(false,gameState.miniMap);
    }

    next = (gameState) => {
        setLeaderboardHidden(true,gameState.leaderboard);
        setFPSHidden(true,gameState.fpsdiv);
        setMiniMapHidden(true,gameState.miniMap);
        return new initGame();
    }
}

class disconnectState {

    start = (gameState) => {
         gameState.viewManager.stopRendering();
         setLeaderboardHidden(true,gameState.leaderboard);
         setPlaymenuHidden(true,gameState.playmenu);
         setFPSHidden(true,gameState.fpsdiv);
         setMiniMapHidden(true,gameState.miniMap);
         this.disconnect();
     }
 
     next = (gameState) => {
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
        console.log("connect state")
         document.getElementById("connexion-server").classList.remove("hidden");
     }
 
     next = (gameState) => {
         document.getElementById("connexion-server").classList.add("hidden");
         return new loadState();
     }


}

class loadState {
    
    start = (gameState) => {
        console.log("load state")
         document.getElementById("load-server").classList.remove("hidden");
     }
 
     next = (gameState) => {
         document.getElementById("load-server").classList.add("hidden");
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

        this.state.start(this)
        this.playbutton.onclick = () => { 
            this.viewManager.username = this.usernameInput.value;
            callbackPlay(this.usernameInput.value);
            this.nextState(); 
        };
        
        
    }

    nextState = () => {
        this.state = this.state.next(this);
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
        console.log("CONNECT STATE")
        this.nextState();
    }


}