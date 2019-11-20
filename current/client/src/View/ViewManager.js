import { debounce } from 'throttle-debounce';
import AnimationMenu from './AnimationMenu'
var equal = require('deep-equal');
const Constants = require('../shared/constants');
const { MAP_SIZE } = Constants;

var times = [];
var fps;

const round = (num) => {
  return Math.round(num * 10) / 10;
}

class ViewManager{

    constructor(networkManager){
        this.currentGameState = {};
        this.networkManager = networkManager;
        this.animMenu = undefined;

        this.miniMap = undefined;
        this.playMenu = document.getElementById('play-menu');
        this.playButton = document.getElementById('play-button');
        this.usernameInput = document.getElementById('username-input');
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');      
        this.leaderboard = document.getElementById('leaderboard');
        this.setCanvasDimensions();
        window.addEventListener('resize', debounce(40, this.setCanvasDimensions));
        this.usernameInput.focus();
        this.playButton = document.getElementById('play-button');
        
        this.lastState = {};
    //    this.initRender();
        this.canvasMiniMap = document.getElementById('mini-map-canvas');
      
     
        var uri = 'worker_mini_map.js';
        var monWorker = new Worker(uri);
      
    }

    renderLeaderboard(leaderboard){
      var tbody = this.leaderboard.getElementsByTagName('tbody')[0];
      tbody.innerHTML = ""; //Clear scores
      var cpt = 0;
      
      leaderboard.forEach((elem) => {
        //console.log(elem);
        cpt++;
        var tr = document.createElement('tr');
        var tdRank = document.createElement('td');
        var tdName = document.createElement('td');
        var tdScore = document.createElement('td');

        tdRank.innerText = cpt;
        tdName.innerText = elem.username;
        tdScore.innerText = elem.score;
        
        tr.appendChild(tdRank);
        tr.appendChild(tdName);
        tr.appendChild(tdScore);
        tbody.appendChild(tr);
      })
    }

    renderFPS = () => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
      }
      times.push(now);
      fps = times.length;
      document.getElementById('fps').innerText = fps;
    }

    setCanvasDimensions = () => {
        // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
        // 800 in-game units of width.
        const scaleRatio = Math.max(1, 800 / window.innerWidth);
        this.canvas.width = scaleRatio * window.innerWidth;
        this.canvas.height = scaleRatio * window.innerHeight;
        console.log(Constants.MAP_SIZE/Constants.MAP_TILE)
        document.getElementById("mini-map").style.height = Constants.MAP_SIZE/Constants.MAP_TILE+"px";
        document.getElementById("mini-map").style.width = Constants.MAP_SIZE/Constants.MAP_TILE+"px";
    }

    renderBackground() {
        this.context.fillStyle = 'grey';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRecurseQuad = (x,y,i,me) => {

        if(i >= Constants.MAP_SIZE/Constants.MAP_TILE) return;

        this.context.beginPath();
        this.context.moveTo(x+i*Constants.MAP_TILE,y);
        this.context.lineTo(x+i*Constants.MAP_TILE,y+Constants.MAP_SIZE);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(x,y+i*Constants.MAP_TILE);
        this.context.lineTo(x+Constants.MAP_SIZE, y+i*Constants.MAP_TILE);
        this.context.stroke();

        this.drawRecurseQuad(x,y,i+1,me);
    }

   renderMap(map,me){
      // Draw boundaries
      this.context.strokeStyle = 'black';
      this.context.lineWidth = 1;
      var topLeftMap = {x: this.canvas.width / 2 - me.x, y: this.canvas.height / 2 - me.y};

      this.context.save();
      this.context.fillStyle ='rgb(64,64,64)';
      this.context.rect(topLeftMap.x, topLeftMap.y, MAP_SIZE, MAP_SIZE);
      this.context.fill();
      this.context.stroke();
      this.context.strokeStyle ="green";
      this.drawRecurseQuad(topLeftMap.x, topLeftMap.y,0,me);
      this.context.restore();


      this.context.save();
      map.forEach((element) => {
        var caseMap = element.value;
        let xrect = round(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2);
        let yrect = round(topLeftMap.y+caseMap.y-Constants.MAP_TILE/2);

        if(caseMap.type === Constants.TYPECASE.VIDE) {
        /*  this.context.beginPath();
          this.context.fillStyle ='rgb(64,64,64)';
          this.context.strokeStyle ="green";
          this.context.rect(xrect, yrect, Constants.MAP_TILE, Constants.MAP_TILE);
         // this.context.fill();
          this.context.stroke();*/
        }
        else if(caseMap.type === Constants.TYPECASE.PATH){  
          this.context.beginPath();
          this.context.fillStyle = caseMap.color;
          this.context.arc( topLeftMap.x+caseMap.x, topLeftMap.y+caseMap.y, Constants.MAP_TILE/4, 0, 2*Math.PI, true);
          this.context.fill();
          this.context.stroke();
        }else if(caseMap.type === Constants.TYPECASE.AREA){  
          this.context.beginPath();
          this.context.fillStyle = caseMap.color;
       //   this.context.strokeStyle =	"rgb(0, 191, 255)";
          this.context.rect(xrect, yrect, Constants.MAP_TILE, Constants.MAP_TILE);
          this.context.fill();
      //    this.context.stroke();
          if(caseMap.path !== undefined) {
            this.context.beginPath();
            this.context.fillStyle = caseMap.path.color;
            this.context.arc( topLeftMap.x+caseMap.x, topLeftMap.y+caseMap.y, Constants.MAP_TILE/4, 0, 2*Math.PI, true);
            this.context.fill();
            this.context.stroke();
          }     
        
      }
      });
      this.context.restore();
   }

    renderPlayer = (me, player) => {
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

      renderMainMenu = () => {
       // if (this.animMenu == undefined ) this.animMenu = new AnimationMenu(this.canvas.width,this.canvas.height);
       // this.animMenu.draw(this.context);
       // console.log("render")
        this.renderBackground();
      }

      renderMiniMap = () => {
          document.getElementById('mini-map').classList.remove('hidden');
          var ctx = this.canvasMiniMap.getContext('2d'); 
          ctx.clearRect(0,0, Constants.MAP_SIZE/Constants.MAP_TILE, Constants.MAP_SIZE/Constants.MAP_TILE)
         // console.log(this.miniMap)
        /*  this.miniMap.forEach((element) => {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = element.value.color;
            ctx.rect(element.key.x,  element.key.y, 1, 1);
            ctx.fill();
            ctx.restore();
          });*/
         // console.log(this.miniMap)
       /*   for(var y = 0; y < this.miniMap.length; y++){
            for(var x = 0; x < this.miniMap[y].length; x++){
              if(!this.miniMap[y][x].value){
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = 'black';
                ctx.rect(x*10, y*10, 10, 10);
                ctx.fill();
                ctx.restore();
              }
            }
          }*/
      }

      render = () => {
        //var state = this.networkManager.getCurrentState();
          const {me, others, map, leaderboard, miniMap} = this.currentGameState;
          if (!me || !map) {return;}
          if(this.miniMap !== miniMap) {
            this.miniMap = miniMap
         //   this.renderMiniMap();
          }
          this.context.clearRect(0,0, this.canvas.width, this.canvas.height)
          this.renderBackground();
          this.renderLeaderboard(leaderboard);
         this.renderMap(map,me);
          this.renderPlayer(me, me);
          others.forEach(this.renderPlayer.bind(null, me));
          this.renderFPS();
      }
      
      startRendering() {
       clearInterval(this.renderInterval);
       this.renderInterval = setInterval(this.render, 1000 / Constants.UI_REFRESH_HZ);
      }
      
      stopRendering() {
        clearInterval(this.renderInterval);
        this.playMenu.classList.remove('hidden');
        this.renderInterval = setInterval(this.renderMainMenu, 1000 / Constants.UI_REFRESH_HZ);
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