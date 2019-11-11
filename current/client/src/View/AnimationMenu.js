import Constants from '../shared/constants'

class AnimationMenu {

    constructor(w,h){
        this.longueur = w;
        this.hauteur = h; 
        this.nbAnim = 10;

        this.element = [];

        for(var i = 0; i < this.nbAnim; i++){
            var r = 255*Math.random()|0,g = 255*Math.random()|0,b = 255*Math.random()|0;
            var value = {
                x: Math.floor(Math.random() * Math.floor(this.longueur)),
                y: Math.floor(Math.random() * Math.floor(this.hauteur)),
                r: Constants.MAP_TILE,
                angle: Math.floor(Math.random() * Math.floor(360))*(Math.PI/180),
                speed: 15,
                color: 'rgb(' + r + ',' + g + ',' + b + ')'
            }
            this.element.push(value);
        }
    }

    draw(context){
        for(var i = 0; i < this.element.length; i++){

            this.element.x += this.element.speed * Math.sin(this.element.angle);
            this.element.y += this.element.speed * Math.cos(this.element.angle);

            this.context.save();
            this.context.fillStyle=this.element.color;
            this.context.translate(this.element.x, this.element.y);
            this.context.beginPath();
            this.context.arc( 0, 0, this.element.r/2, 0, 2*Math.PI, true);
            this.context.fill();
            this.context.stroke();
            this.context.restore();
        }
    }



}

export default AnimationMenu;