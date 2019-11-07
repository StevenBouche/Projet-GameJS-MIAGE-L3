var state = {
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false,
}

var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40 };

var Singleton = (function () {
    var instance;
    
    function createInstance() {
        var object = new KeyBoardManager();
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();


class KeyBoardManager {

    constructor(){
        document.addEventListener('keydown',this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);
    }

    getState(){
        return state;
    }

    keyDownHandler(event) {
       console.log(event)
        if(event.keyCode == 39 && !state.rightPressed) {
            state.rightPressed = true;
            console.log("droite")
        }
        else if(event.keyCode == 37 && !state.leftPressed) {
            state.leftPressed = true;
            console.log("gauche")
        }
        else if(event.keyCode == 40 && !state.downPressed ) {
            state.downPressed = true;
            console.log("bas")
        }
        else if(event.keyCode == 38 && !state.upPressed) {
            state.upPressed = true;
            console.log("haut")
        }
        event.preventDefault();
    }

    keyUpHandler(event) {
        if(event.keyCode == 39) state.rightPressed = false;
        else if(event.keyCode == 37) state.leftPressed = false;
        else if(event.keyCode == 40) state.downPressed = false;
        else if(event.keyCode == 38) state.upPressed = false;
        event.preventDefault();
    }

}

export default Singleton;