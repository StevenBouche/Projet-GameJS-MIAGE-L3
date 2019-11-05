export default class Map {

    constructor(){
        this.canvas = undefined;
        this.context = undefined;
        this.sizeTuiles = 20;
        this.nbTuilesWidth = 32;
        this.nbTuilesHeight = 18;
        this.width = 0;
        this.height = 0;
        this.colorBackground = 'blue';
        //Calcule dt
        this.deltaTime = 0;
        this.currentTime = 0;
        this.lastTime = 0;

        this.init();
        this.initQuadrillage();
        requestAnimationFrame(this.anime());
    }

    initQuadrillage(){
     /*   this.context.beginPath();
        for(let i = 1; i < this.nbTuilesWidth; i++){
            this.context.moveTo(i*this.sizeTuiles,0);
            this.context.lineTo(i*this.sizeTuiles,this.height);
        }
        for(let i = 1; i < this.nbTuilesHeight; i++){
            this.context.moveTo(0,i*this.sizeTuiles);
            this.context.lineTo(this.width,i*this.sizeTuiles);
        }
        this.context.stroke();*/
    }
    
    init(){
        this.canvas = document.querySelector("#myCanvas");
        console.log(this.canvas)
   /*     this.width = this.sizeTuiles * this.nbTuilesWidth;
        this.height = this.sizeTuiles * this.nbTuilesHeight;
        this.canvas.setAttribute("width", this.width);
        this.canvas.setAttribute("height", this.height);
        this.context = this.canvas.getContext('2d');*/
    }
    
    anime() {
        
 //       this.currentTime = (new Date()).getTime();
  //      this.deltaTime = (this.currentTime - this.lastTime) / 1000;
  //      console.log(this.deltaTime);
   //     this.context.clearRect(0, 0, this.width, this.height);
    
        //Background
   //     this.context.fillStyle = this.colorBackground;
   //     this.context.fillRect(0, 0, this.width, this.height);
    
   //     this.initQuadrillage();
      //  PlayerOne.draw(context,deltaTime);
    
 //       this.lastTime = this.currentTime;
    
        //60frames/seconde
        requestAnimationFrame(this.anime());
    }

}