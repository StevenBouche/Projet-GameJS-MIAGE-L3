import { debounce } from 'throttle-debounce';
const Constants = require('../shared/constants');
const { MAP_SIZE, MAP_TILE } = Constants;
var equal = require('deep-equal');

class ViewManager{

    constructor(getstate){
        this.playMenu = document.getElementById('play-menu');
        this.playButton = document.getElementById('play-button');
        this.usernameInput = document.getElementById('username-input');
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');
        this.setCanvasDimensions();
        this.networkManager = getstate;
        window.addEventListener('resize', debounce(40, this.setCanvasDimensions.bind(this)));
      


        this.playMenu.classList.remove('hiddeSn');
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

        this.renderInterval = requestAnimationFrame(this.renderMainMenu.bind(this));//setInterval(this.renderMainMenu.bind(this), 1000 / 60);
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
      this.context.save();
      map.forEach( (element) => {
        element.forEach((caseMap) => {
          this.context.beginPath();
                this.context.strokeStyle ="green";
                this.context.fillStyle ="blue";
                this.context.rect(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2, topLeftMap.y+caseMap.y-Constants.MAP_TILE/2, Constants.MAP_TILE, Constants.MAP_TILE);
                this.context.fill();
                this.context.stroke(); 
        })
      })
      this.context.restore();
   }

    renderPlayer(me, player) {
        const { x, y, direction } = player;
      //  console.log(player)
        const canvasX = this.canvas.width / 2 + x - me.x;
        const canvasY = this.canvas.height / 2 + y - me.y;
      
        // Draw ship
        this.context.save();
          var r = 255*Math.random()|0,
              g = 255*Math.random()|0,
              b = 255*Math.random()|0;

        this.context.fillStyle='rgb(' + r + ',' + g + ',' + b + ')';
        this.context.translate(canvasX, canvasY);
        this.context.beginPath();
        this.context.arc( 0, 0, Constants.MAP_TILE/2, 0, 2*Math.PI, true);
        this.context.fill();
        this.context.stroke();
  
       /* this.context.fillStyle = 'red';
        this.context.translate(canvasX, canvasY);
        this.context.rotate(direction);
        this.context.fillRect(-Constants.MAP_TILE/2, -Constants.MAP_TILE/2, Constants.MAP_TILE, Constants.MAP_TILE);*/
        this.context.restore();
      }

      renderMainMenu() {
        const t = Date.now() / 7500;
        const x = MAP_SIZE / 2 + 800 * Math.cos(t);
        const y = MAP_SIZE / 2 + 800 * Math.sin(t);
        this.renderBackground();
      //  this.renderInterval = requestAnimationFrame(this.renderMainMenu.bind(this));
      }

      render() {
        var state = this.networkManager.getCurrentState();
        const { me, others, map} = state;
      //   console.log(me)
        if (!me && !map) {
          return;
        }
        this.renderBackground();
        this.renderMap(map,me);
        this.renderPlayer(me, me);
        others.forEach(this.renderPlayer.bind(this).bind(null, me));
      //  this.renderInterval = requestAnimationFrame(this.render.bind(this));
      }
      
      // Replaces main menu rendering with game rendering.
      startRendering() {
        cancelAnimationFrame(this.renderInterval)
        this.renderInterval = requestAnimationFrame(this.render.bind(this));
       // clearInterval(this.renderInterval);
       // this.renderGameOrNot = true;
        //this.render();
        this.renderInterval = setInterval(this.render.bind(this), 1000 / 60);
      }
      
      // Replaces game rendering with main menu rendering.
      stopRendering() {
        //clearInterval(this.renderInterval);
        cancelAnimationFrame(this.renderInterval)
        this.renderInterval = requestAnimationFrame(this.renderMainMenu.bind(this));
      //  this.renderGameOrNot = false;
       // this.renderInterval = setInterval(this.renderMainMenu.bind(this), 1000 / 60);
      }
      
}

export default ViewManager;