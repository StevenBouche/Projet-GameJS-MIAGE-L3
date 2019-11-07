import WinListener from '../listener/WindowDimLister'
import KeyBoardManager from '../manager/KeyboardManager'
var equal = require('deep-equal');

class ViewManager{

    constructor(gameManager){
        this.ID = '_' + Math.random().toString(36).substr(2, 9);
        this.gameManager = gameManager;
        //Element
        this.canvas = undefined;
        this.context = undefined;
        //Parameters
        this.sizeTuiles      = 16;
        this.nbTuilesWidth   = 0;
        this.nbTuilesHeight  = 0;
        this.width = 0;
        this.height = 0;
        this.colorBackground = 'blue';
        this.lastTime = (new Date()).getTime();
        this.currentTime = 0;
        this.deltaTime = 0;
        this.kbManager = KeyBoardManager.getInstance();
        this.winListener = WinListener.getInstance();
        this.lastScreen = undefined;
        this.center = { x: 0, y: 0}
        this.init();
        requestAnimationFrame(this.anime.bind(this));
    }

    getContext(){
        return this.context;
    }

    getSizeTuiles(){
        return this.sizeTuiles;
    }

    setDim(width,height){
        this.width = width;
        this.height = height; 
        this.nbTuilesWidth   = this.width/this.sizeTuiles;
        this.nbTuilesHeight  = this.height/this.sizeTuiles;
        this.center = {x : this.width/2,y: this.height/2}
    }

    updatedimWindows(width,height){
        console.log("update win dim")
        this.setDim(width,height);
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
    }

    init(){
        this.canvas = document.querySelector("#myCanvas");
    
       this.winListener.addObserver(this.ID,this.updatedimWindows.bind(this));
       this.setDim(this. winListener.state.width,this.winListener.state.height);
       this.canvas.setAttribute("width", this.width);
       this.canvas.setAttribute("height", this.height);
       this.context = this.canvas.getContext('2d');
       var screen = this.gameManager.getScreenPlayer(this.nbTuilesWidth/2,this.nbTuilesHeight/2,this.sizeTuiles);
       console.log(screen);
    }

    initQuadrillage(screen){
      
          //  this.context.beginPath();
    
         
        for(let i = 0; i < screen.length; i++){
            for(let x = 0; x < screen[i].length; x++){
                this.context.save();

                var transX = (x*this.sizeTuiles);
                var transY = (i*this.sizeTuiles);
                
                if(screen[i][x] == 1){
                 this.context.fillStyle = ('blue');
                } else if(screen[i][x] == 2){
                    this.context.fillStyle = ('red');
                }
                else this.context.fillStyle = ('white');

                this.context.translate(transX, transY);
                this.context.beginPath();
                this.context.strokeStyle ="green";
                this.context.rect(0, 0, this.sizeTuiles, this.sizeTuiles);
                this.context.fill();
                this.context.stroke(); 
                this.context.restore();
            }
            
           // this.context.moveTo(0,i*this.sizeTuiles);
           // this.context.lineTo(this.width,i*this.sizeTuiles);
        }
       
       // this.context.stroke();
        
        this.lastScreen = screen;
    }

    anime() {
        this.currentTime = (new Date()).getTime();
        this.deltaTime = (this.currentTime - this.lastTime) / 1000;
       //console.log(deltaTime);
        
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillRect(0, 0, this.width, this.height);
        
       
     //   var screen = this.gameManager.getScreenPlayer(Math.round(this.nbTuilesWidth/2),Math.round(this.nbTuilesHeight/2),this.sizeTuiles);

     //   this.initQuadrillage(screen);
      //  this.drawIndicateur();
        var state = this.kbManager.getState();
        this.gameManager.getPlayer().draw(this.context,this.deltaTime,state,this.width/2,this.height/2);

    //    this.playerManager.update(this.context,this.deltaTime);

     //   
      //  this.mapGame.getCoord(pos.x,pos.y,this.sizeTuiles);
     
        this.lastTime = this.currentTime;
    
        //60frames/seconde
        requestAnimationFrame(this.anime.bind(this));
    }

    drawIndicateur(){
        this.context.save();
        this.context.translate(this.width/2, this.height/2);
        this.context.beginPath();
        this.context.strokeStyle ="yellow";
        this.context.rect(-(this.sizeTuiles*3), -(this.sizeTuiles*3), this.sizeTuiles*6, this.sizeTuiles*6);
      //  this.context.fill();
        this.context.stroke(); 
        this.context.restore();
    }

   
}

var Singleton = (function () {
    var instance;
    
    function createInstance(gm) {
        var object = new ViewManager(gm);
        return object;
    }
 
    return {
        getInstance: function (gm) {
            if (!instance) {
                instance = createInstance(gm);
            }
            return instance;
        }
    };
})();

export default Singleton;