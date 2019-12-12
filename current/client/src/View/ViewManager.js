import { debounce } from 'throttle-debounce';
import AnimationMenu from './AnimationMenu'
import Worker from './map.worker.js';
import Skin from '../skin/skin';

var equal = require('deep-equal');
const Constants = require('../shared/constants');
const { MAP_SIZE } = Constants;

var times = [];
var fps;

const round = (num) => {
  return Math.round(num);
}

class ViewManager{

    constructor(networkManager){

        this.currentGameState = {};
        this.networkManager = networkManager;

        this.animMenu = undefined;
        this.miniMap = undefined;

        this.leaderboard = document.getElementById('leaderboard');
        this.canvas = document.getElementById('game-canvas');
        this.canvasMiniMap = document.getElementById('mini-map-canvas');
        this.context = this.canvas.getContext('2d');    
        this.offscreenSet = false;
        this.setCanvasDimensions();
        window.addEventListener('resize', debounce(40, this.setCanvasDimensions));
   
        //Thread render mini map
        this.worker = new Worker();
        this.offscreenCanvas = this.canvasMiniMap.transferControlToOffscreen();
        this.testWorker();

        // Handle Skin
        document.getElementById('previousSkin').onclick = () => { this.handleSkin(-1); }
        document.getElementById('nextSkin').onclick = () => { this.handleSkin(1); }
        this.skinCanvas =  document.getElementById('skin');
        this.ctxSkin = this.skinCanvas.getContext("2d");
        this.skin = undefined;
        this.skinIndex = 0;
        this.handleSkin(this.skinIndex);
    }

    testWorker = () => {
        this.worker.onmessage = (event) => {
            if (event.data.type === 'resolved') this.worker.terminate();
            else if(event.data.type === 'getData') {
              this.worker.postMessage({
                type: 'dataSend',
                minimap: this.currentGameState.minimap
              });
            }
        };

        this.worker.postMessage({type: 'setCanvas', canvas: this.offscreenCanvas}, [this.offscreenCanvas]);
    }

    handleSkin = (v) => {
      this.skinIndex += v;
      if(this.skinIndex < 0 ) this.skinIndex = Skin.nbElement;
      else if(this.skinIndex > Skin.nbElement) this.skinIndex = 0;
      console.log(this.skinIndex);
      this.ctxSkin.clearRect(0,0, this.skinCanvas.width, this.skinCanvas.height)
      Skin.render(this.skinIndex,{x:0,y:0},{x:0,y:0,color:"yellow"},this.skinCanvas,this.ctxSkin)
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

      var tbody = document.getElementById('fps').getElementsByTagName('tbody')[0];
      tbody.innerHTML = "";

      var tr = document.createElement('tr');
      var tdfps = document.createElement('td');
      tdfps.innerText = fps;
      tr.appendChild(tdfps);
      tbody.appendChild(tr);
    }

    setCanvasDimensions = () => {
        // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
        // 800 in-game units of width.
        const scaleRatio = Math.max(1, 800 / window.innerWidth);
        this.canvas.width = scaleRatio * window.innerWidth;
        this.canvas.height = scaleRatio * window.innerHeight;

        if(this.offscreenSet == false) {
          document.getElementById("mini-map").style.height = (Constants.MAP_SIZE/Constants.MAP_TILE)*Constants.MINI_MAP_SIZE +"px";
          document.getElementById("mini-map").style.width = (Constants.MAP_SIZE/Constants.MAP_TILE)*Constants.MINI_MAP_SIZE +"px";
          this.canvasMiniMap.height = (Constants.MAP_SIZE/Constants.MAP_TILE)*Constants.MINI_MAP_SIZE;
          this.canvasMiniMap.width = (Constants.MAP_SIZE/Constants.MAP_TILE)*Constants.MINI_MAP_SIZE;
          
          this.offscreenSet = true;
        }
    }

    renderBackground() {
        this.context.fillStyle = 'grey';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRecurseQuad = (x,y,i,me) => {

        if(i >= Constants.MAP_SIZE/Constants.MAP_TILE) return;

        this.context.beginPath();
        this.context.moveTo(round(x+i*Constants.MAP_TILE),round(y));
        this.context.lineTo(round(x+i*Constants.MAP_TILE),round(y+Constants.MAP_SIZE));
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(round(x),round(y+i*Constants.MAP_TILE));
        this.context.lineTo(round(x+Constants.MAP_SIZE), round(y+i*Constants.MAP_TILE));
        this.context.stroke();

        this.drawRecurseQuad(x,y,i+1,me);
    }

   renderMap(map,me){

      this.context.strokeStyle = 'black';
      this.context.lineWidth = 1;
      var topLeftMap = {x: this.canvas.width / 2 - me.x, y: this.canvas.height / 2 - me.y};

      this.context.save();
      this.context.fillStyle ='rgb(64,64,64)';
      this.context.rect(topLeftMap.x, topLeftMap.y, MAP_SIZE, MAP_SIZE);
      this.context.fill();
      this.context.stroke();
      this.context.restore();

      this.context.save();
      map.forEach((element) => {
      var caseMap = element;
      let xrect = round(topLeftMap.x+caseMap.x-Constants.MAP_TILE/2);
      let yrect = round(topLeftMap.y+caseMap.y-Constants.MAP_TILE/2);

        if(caseMap.type === Constants.TYPECASE.PATH){  
          this.context.beginPath();
          this.context.fillStyle = caseMap.color;
          this.context.arc( topLeftMap.x+caseMap.x, topLeftMap.y+caseMap.y, Constants.MAP_TILE/4, 0, 2*Math.PI, true);
          this.context.fill();
          this.context.stroke();
        }else if(caseMap.type === Constants.TYPECASE.AREA){  
          this.context.beginPath();
          this.context.fillStyle = caseMap.color;
          this.context.rect(xrect, yrect, Constants.MAP_TILE, Constants.MAP_TILE);
          this.context.fill();
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

      this.context.save();
      this.context.strokeStyle ="green";
      this.drawRecurseQuad(topLeftMap.x, topLeftMap.y,0,me);
      this.context.restore();
   }

    renderPlayer = (me, player) => {
        if(me.id === player.id) Skin.render(me.idskin,me,player,this.canvas,this.context);
        else Skin.render(player.idskin,me,player,this.canvas,this.context);
      }

      renderMainMenu = () => {
        if (this.animMenu == undefined ) this.animMenu = new AnimationMenu(this.canvas.width,this.canvas.height);
        this.animMenu.draw(this.context);
      }

      render = () => {
          const {me, others, map, leaderboard, minimap} = this.currentGameState;
          if (!me || !map) return;
          if(this.miniMap !== minimap) this.miniMap = minimap
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
        this.animMenu = undefined;
        //Commentaire car render syncro sur le tick server
        // this.renderInterval = setInterval(this.render, 1000 / Constants.UI_REFRESH_HZ); 
      }
      
      stopRendering() {
        clearInterval(this.renderInterval);
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