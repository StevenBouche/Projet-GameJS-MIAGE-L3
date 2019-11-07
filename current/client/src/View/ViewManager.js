import { debounce } from 'throttle-debounce';
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
        window.addEventListener('resize', debounce(40, this.setCanvasDimensions.bind(this)));
        this.renderInterval = setInterval(this.renderMainMenu.bind(this), 1000 / 60);


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

    render() {
        const { me, others} = this.networkManager.getCurrentState();
     //   console.log(me)
        if (!me) {
          return;
        }
      
        // Draw background
        this.renderBackground();
      
        // Draw boundaries
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 1;
        this.context.strokeRect(this.canvas.width / 2 - me.x, this.canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);
      //  console.log(me);
        // Draw all players
        this.renderPlayer(me, me);
        
     /*   for(var i = 0; i < others.length; i++){
            this.renderPlayer({x: 0, y:0},others[i]);
        }*/
        others.forEach(this.renderPlayer.bind(this).bind(null, me));
    }

   

    renderPlayer(me, player) {
        const { x, y, direction } = player;
        console.log(player)
        const canvasX = this.canvas.width / 2 + x - me.x;
        const canvasY = this.canvas.height / 2 + y - me.y;
      
        // Draw ship
        this.context.save();
        this.context.fillStyle = 'red';
        this.context.translate(canvasX, canvasY);
        this.context.rotate(direction);
        this.context.fillRect(-20, -20, 40, 40);
        this.context.restore();
      }

      renderMainMenu() {
        const t = Date.now() / 7500;
        const x = MAP_SIZE / 2 + 800 * Math.cos(t);
        const y = MAP_SIZE / 2 + 800 * Math.sin(t);
        this.renderBackground();
      }
      
      // Replaces main menu rendering with game rendering.
      startRendering() {
        clearInterval(this.renderInterval);
        this.renderInterval = setInterval(this.render.bind(this), 1000 / 60);
      }
      
      // Replaces game rendering with main menu rendering.
      stopRendering() {
        clearInterval(this.renderInterval);
        this.renderInterval = setInterval(this.renderMainMenu.bind(this), 1000 / 60);
      }
      


}

export default ViewManager;