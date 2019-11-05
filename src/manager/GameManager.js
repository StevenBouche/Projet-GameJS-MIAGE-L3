
import PlayerManager from './PlayerManager'

const GameManager = {};

//Element
let canvas;
let context;
//Parameters
let sizeTuiles      = 20;
let nbTuilesWidth   = 32;
let nbTuilesHeight  = 18;
let width           = 0;
let height = 0;
let colorBackground = 'blue';
let lastTime = (new Date()).getTime();
let currentTime = 0;
let deltaTime = 0;

let playerManager = PlayerManager.getInstance();

function initQuadrillage(){
    context.beginPath();
    for(let i = 1; i < nbTuilesWidth; i++){
        context.moveTo(i*sizeTuiles,0);
        context.lineTo(i*sizeTuiles,height);
    }
    for(let i = 1; i < nbTuilesHeight; i++){
        context.moveTo(0,i*sizeTuiles);
        context.lineTo(width,i*sizeTuiles);
    }
    context.stroke();
}

function init(){
    canvas = document.querySelector("#myCanvas");
    width = sizeTuiles * nbTuilesWidth;
    height = sizeTuiles * nbTuilesHeight;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    context = canvas.getContext('2d');
}

function anime() {
    currentTime = (new Date()).getTime();
    deltaTime = (currentTime - lastTime) / 1000;
   //console.log(deltaTime);
    context.clearRect(0, 0, width, height);

    //Background
    context.fillStyle = colorBackground;
    context.fillRect(0, 0, width, height);

    initQuadrillage();
    playerManager.update(context,deltaTime);

    lastTime = currentTime;

    //60frames/seconde
    requestAnimationFrame(anime);
}

GameManager.init = () => {
    init();
    initQuadrillage();
    requestAnimationFrame(anime);
}

var Singleton = (function () {
    var instance;
    
    function createInstance() {
        var object = GameManager;
        object.init();
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

export default Singleton;

