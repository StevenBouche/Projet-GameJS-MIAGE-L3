import Constants from '../shared/constants'

class AnimationMenu {

    constructor(w,h){
        this.longueur = w;
        this.hauteur = h; 
        this.nbAnim = 60;

        this.element = [];

        for(var i = 0; i < this.nbAnim; i++){
            var r = 255*Math.random()|0,g = 255*Math.random()|0,b = 255*Math.random()|0;
            var value = {
                x: Math.floor(Math.random() * Math.floor(this.longueur)),
                y: Math.floor(Math.random() * Math.floor(this.hauteur)),
                r: Constants.MAP_TILE,
                angle: Math.floor(Math.random() * Math.floor(360))*(Math.PI/180),
                speed: 2,
                color: 'rgb(' + r + ',' + g + ',' + b + ')'
            }
            this.element.push(value);
        }
    }

    collision = (c) => {
        if (c.y+(c.r/2)  > this.hauteur || c.y-(c.r/2)  < 0) {
            c.angle = Math.floor(Math.random() * Math.floor(360))*(Math.PI/180);
        }
        if (c.x+(c.r/2)  > this.longueur || c.x-(c.r/2)  < 0) {
            c.angle = Math.floor(Math.random() * Math.floor(360))*(Math.PI/180);
        }
    }

    draw = (context) => {
        context.clearRect(0,0, this.longueur, this.hauteur)
        for(var i = 0; i < this.element.length; i++){
            this.element[i].x += this.element[i].speed * Math.sin(this.element[i].angle);
            this.element[i].y += this.element[i].speed * Math.cos(this.element[i].angle);
            this.collision(this.element[i]);
  
            context.save();
            context.fillStyle=this.element[i].color;
            context.translate(this.element[i].x, this.element[i].y);
            context.beginPath();
            context.arc( 0, 0, this.element[i].r/2, 0, 2*Math.PI, true);
            context.fill();
            context.stroke();
            context.restore();
        }
    }



}

export default AnimationMenu;