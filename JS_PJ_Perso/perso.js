class Skin{
    constructor(x,y,couleur,largeur){
        this.x=x;
        this.y=y;
        this.couleur=couleur;
        this.largeur=largeur/2;
    }
}

//PACMAN
class Pacman extends Skin{
    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.largeur, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(this.x, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fillStyle=this.couleur;
        ctx.fill();
        ctx.strokeStyle="#000";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x,this.y-(this.largeur/2),this.largeur*(1/8),0,2*Math.PI);
        ctx.closePath();
        ctx.fillStyle="#000";
        ctx.fill();
        ctx.strokeStyle="#FFF";
        ctx.stroke();
        ctx.restore();
    }
}
//GHOST
class Ghost extends Skin{
    draw(){
        ctx.save();
        //FORME
        ctx.beginPath();
            ctx.arc(this.x,this.y,this.largeur,Math.PI,2*Math.PI);
            ctx.rect(this.x-this.largeur,this.y,this.largeur*2,this.largeur*(3/4));
            ctx.moveTo(this.x-this.largeur,this.y+(this.largeur)*(3/4));
            ctx.lineTo(this.x-this.largeur,this.y+this.largeur);
            ctx.lineTo(this.x-(this.largeur)*(3/4),this.y+(this.largeur)*(3/4));
            ctx.lineTo(this.x-this.largeur*(1/2),this.y+this.largeur);
            ctx.lineTo(this.x-this.largeur*(1/4),this.y+this.largeur*(3/4));
            ctx.lineTo(this.x,this.y+this.largeur);
            ctx.lineTo(this.x+this.largeur*(1/4),this.y+this.largeur*(3/4));
            ctx.lineTo(this.x+this.largeur*(1/2),this.y+this.largeur);
            ctx.lineTo(this.x+this.largeur*(3/4),this.y+this.largeur*(3/4));
            ctx.lineTo(this.x+this.largeur,this.y+this.largeur);
            ctx.lineTo(this.x+this.largeur,this.y+this.largeur*(3/4));
        ctx.closePath();
        ctx.fillStyle=this.couleur;
        ctx.fill();
        //OEIL
        ctx.beginPath();
            ctx.arc(this.x-this.largeur*(1/3.5),this.y-this.largeur*(1/6),this.largeur*(1/7),0,2*Math.PI);
            ctx.arc(this.x+this.largeur*(1/2.8),this.y-this.largeur*(1/6),this.largeur*(1/7),0,2*Math.PI);
        ctx.closePath();
        ctx.fillStyle="#FFF";
        ctx.fill();
        
        //OEIL INTERIEUR
        ctx.beginPath();
        ctx.arc(this.x-this.largeur*(1/4),this.y-this.largeur*(1/6),this.largeur*(1/15),0,2*Math.PI);
        ctx.arc(this.x+this.largeur*(1/2.5),this.y-this.largeur*(1/6),this.largeur*(1/15),0,2*Math.PI);
        ctx.closePath();
        ctx.fillStyle="#000";
        ctx.fill();
        ctx.restore();
    }
}
//SONIC
class P3{
    draw(){
        ctx.save();

        ctx.restore();
    }
}



window.onload=init();

function init(){
    canvas=document.getElementById("cv");
    canvas.style.background="lightgrey";
    ctx=canvas.getContext("2d");

    pacman=new Pacman(170,300,"#FF0",200);
    pacman.draw();

    ghost=new Ghost(400,100,"#00F",200);
    ghost.draw();
}