import { debounce } from 'throttle-debounce';
import AnimationMenu from './AnimationMenu'

const Constants = require('../shared/constants');
const { MAP_SIZE } = Constants;

class ViewManager{

    constructor(getstate){
        this.playMenu = document.getElementById('play-menu');
        this.playButton = document.getElementById('play-button');
        this.usernameInput = document.getElementById('username-input');
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasDimensions();
        this.networkManager = getstate;
        this.animMenu = undefined;
        window.addEventListener('resize', debounce(40, this.setCanvasDimensions.bind(this)));

      //  this.playMenu.classList.remove('hidden');
        this.usernameInput.focus();
        this.playButton.onclick = () => {
            // Play!
            this.networkManager.play(this.usernameInput.value);
            this.playMenu.classList.add('hidden');
           // initState();
           // startCapturingInput();
            this.startRendering();
           // this.setLeaderboardHidden(false);
        };

        this.renderGameOrNot = false;
      //  this.renderInterval = setInterval(this.renderMainMenu, 1000 / Constants.UI_REFRESH_HZ);

        this.initRender();
    }

    setCanvasDimensions() {
        // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
        // 800 in-game units of width.
        const scaleRatio = Math.max(1, 800 / window.innerWidth);
        this.canvas.width = scaleRatio * window.innerWidth;
        this.canvas.height = scaleRatio * window.innerHeight;
    }

    renderBackground() {
        this.context.fillStyle = 'grey';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }


   renderMap(map,me){
      // Draw boundaries
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 1;
      var topLeftMap = {x: this.canvas.width / 2 - me.x, y: this.canvas.height / 2 - me.y};
      this.context.strokeRect(topLeftMap.x, topLeftMap.y, MAP_SIZE, MAP_SIZE);
      
      map.forEach( (element) => {
        element.forEach((caseMap) => {
          if(this.isInCamera(me,caseMap.x,caseMap.y)) {
              this.context.save();
            if(caseMap.type === Constants.TYPECASE.VIDE) {
              this.context.beginPath();
              this.context.fillStyle ='rgb(64,64,64)';
              this.context.strokeStyle ="green";
              this.context.rect(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2, topLeftMap.y+caseMap.y-Constants.MAP_TILE/2, Constants.MAP_TILE, Constants.MAP_TILE);
              this.context.fill();
              this.context.stroke();
            }
            else if(caseMap.type === Constants.TYPECASE.PATH){  
              this.context.beginPath();
              this.context.fillStyle ='rgb(64,64,64)';
              this.context.strokeStyle ="green";
              this.context.rect(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2, topLeftMap.y+caseMap.y-Constants.MAP_TILE/2, Constants.MAP_TILE, Constants.MAP_TILE);
              this.context.fill();
              this.context.stroke();
              this.context.beginPath();
              this.context.fillStyle = caseMap.color;
              this.context.arc( topLeftMap.x+caseMap.x, topLeftMap.y+caseMap.y, Constants.MAP_TILE/4, 0, 2*Math.PI, true);
              this.context.fill();
              this.context.stroke();
            }else if(caseMap.type === Constants.TYPECASE.AREA){  
              this.context.beginPath();
              this.context.fillStyle = caseMap.color;
              this.context.strokeStyle ="green";
              this.context.rect(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2, topLeftMap.y+caseMap.y-Constants.MAP_TILE/2, Constants.MAP_TILE, Constants.MAP_TILE);
              this.context.fill();
              this.context.stroke();
              if(caseMap.path !== undefined) {
                this.context.beginPath();
                this.context.fillStyle = caseMap.path.color;
                this.context.arc( topLeftMap.x+caseMap.x, topLeftMap.y+caseMap.y, Constants.MAP_TILE/4, 0, 2*Math.PI, true);
                this.context.fill();
                this.context.stroke();
              }
            }
            this.context.restore();
          }
        })
      })
   }

    renderPlayer(me, player) {
        const { x, y } = player;
      //  console.log(player)
        const canvasX = this.canvas.width / 2 + x - me.x;
        const canvasY = this.canvas.height / 2 + y - me.y;
      
        // Draw ship
        this.context.save();
        this.context.fillStyle=player.color;
        this.context.translate(canvasX, canvasY);
        this.context.beginPath();
        this.context.arc( 0, 0, Constants.MAP_TILE/2, 0, 2*Math.PI, true);
        this.context.fill();
        this.context.stroke();
        this.context.restore();
      }

      renderMainMenu() {
      //  const t = Date.now() / 7500;
    //    const x = MAP_SIZE / 2 + 800 * Math.cos(t);
     //   const y = MAP_SIZE / 2 + 800 * Math.sin(t);
     //   if (this.animMenu == undefined ) this.animMenu = new AnimationMenu(this.canvas.width,this.canvas.height);
    //    this.animMenu.draw(this.context);
        console.log("render")
     //   this.renderBackground();
      }

      render() {
        var state = this.networkManager.getCurrentState();
        const {me, others, map} = state;
        if (!me || !map) {return;}
        this.renderBackground();
        this.renderMap(map,me);
        this.renderPlayer(me, me);
        others.forEach(this.renderPlayer.bind(this).bind(null, me));
      }
      
      startRendering() {
       clearInterval(this.renderInterval);
       this.renderInterval = setInterval(this.render.bind(this), 1000 / Constants.UI_REFRESH_HZ);
      }
      
      stopRendering() {
        clearInterval(this.renderInterval);
        this.playMenu.classList.remove('hidden');
        this.renderInterval = setInterval(this.renderMainMenu.bind(this), 1000 / Constants.UI_REFRESH_HZ);
      }

      initRender(){
        this.renderInterval = setInterval(this.renderMainMenu, 1000 / Constants.UI_REFRESH_HZ);
      }
      
      isInCamera(me,x,y){
        var bornX = this.canvas.width/2 + (this.canvas.width/2)*0.1;
        var bornY = this.canvas.height/2 + (this.canvas.height/2)*0.1;
        if(x > me.x+bornX  || x < me.x-bornX) return false;
        if(y > me.y+bornY || y < me.y-bornY) return false;
        return true;
      }
}

export default ViewManager;