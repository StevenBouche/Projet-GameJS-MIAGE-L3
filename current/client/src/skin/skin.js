import Constants from '../shared/constants'

const skin = {};
skin.nbElement = 3;

let shrekDraw = (me,player,canvas,context,shrekS) => {

   const { x, y } = player;
  //  console.log(player)
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.drawImage(shrekS, canvasX,canvasY, Constants.MAP_TILE, Constants.MAP_TILE);

}

let defaultSkin = (me,player,canvas,context) => {
  const { x, y } = player;
  //  console.log(player)
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
    context.fillStyle=player.color;
    context.translate(canvasX, canvasY);
    context.beginPath();
    context.arc( 0, 0, Constants.MAP_TILE/2, 0, 2*Math.PI, true);
    context.closePath();
    context.fill();
    context.stroke();
  context.restore();
}
//PACMAN
let pacman = (me,player,canvas,context)=> {
  const { x, y } = player;

  console.log(player)
  //  console.log(player)
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
    context.translate(canvasX,canvasY);
    context.beginPath();
      context.arc(0, 0, Constants.MAP_TILE/2, 0.2 * Math.PI, 1.8 * Math.PI);
        context.lineTo(0, 0);       
      context.lineTo(0, 0);
    context.closePath();
    context.fillStyle=player.color;
    context.fill();
    context.strokeStyle="#000";
    context.stroke();
    context.beginPath();
      context.arc(0,-(Constants.MAP_TILE/2)/2,(Constants.MAP_TILE/2)*(1/8),0,2*Math.PI);
    context.closePath();
    context.fillStyle="#000";
    context.fill();
    context.strokeStyle="#FFF";
    context.stroke();
  context.restore();
}

let ghost  = (me,player,canvas,context)=> {
  const { x, y } = player;
  //  console.log(player)
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  context.save();
  context.translate(canvasX, canvasY);
    //FORME
    context.beginPath();
    context.strokeStyle="black";
      context.arc(0,0,Constants.MAP_TILE/2,Math.PI,2*Math.PI);
  //    context.stroke();
      context.rect(-Constants.MAP_TILE/2,0,Constants.MAP_TILE,(Constants.MAP_TILE/2)*(3/4));
      context.moveTo(-Constants.MAP_TILE/2,(Constants.MAP_TILE/2)*(3/4));
      context.lineTo(-Constants.MAP_TILE/2,Constants.MAP_TILE/2);
      context.lineTo(-(Constants.MAP_TILE/2)*(3/4),(Constants.MAP_TILE/2)*(3/4));
      context.lineTo(-Constants.MAP_TILE/2*(1/2),Constants.MAP_TILE/2);
      context.lineTo((-Constants.MAP_TILE/2)*(1/4),(Constants.MAP_TILE/2)*(3/4));
      context.lineTo(0,Constants.MAP_TILE/2);
      context.lineTo((Constants.MAP_TILE/2)*(1/4),(Constants.MAP_TILE/2)*(3/4));
      context.lineTo((Constants.MAP_TILE/2)*(1/2),Constants.MAP_TILE/2);
      context.lineTo((Constants.MAP_TILE/2)*(3/4),(Constants.MAP_TILE/2)*(3/4));
      context.lineTo(Constants.MAP_TILE/2,Constants.MAP_TILE/2);
      context.lineTo(Constants.MAP_TILE/2,(Constants.MAP_TILE/2)*(3/4));
    context.closePath();
    context.fillStyle=player.color;
    context.fill();
  //  context.stroke();
    //OEIL
    context.beginPath();
      context.arc(-(Constants.MAP_TILE/2)*(1/3.5),-(Constants.MAP_TILE/2)*(1/6),(Constants.MAP_TILE/2)*(1/7),0,2*Math.PI);
      context.arc((Constants.MAP_TILE/2)*(1/2.8),-(Constants.MAP_TILE/2)*(1/6),(Constants.MAP_TILE/2)*(1/7),0,2*Math.PI);
    context.closePath();
    context.fillStyle="#FFF";
    context.fill();
      
    //OEIL INTERIEUR
    context.beginPath();
      context.arc(-(Constants.MAP_TILE/2)*(1/4),-(Constants.MAP_TILE/2)*(1/6),(Constants.MAP_TILE/2)*(1/15),0,2*Math.PI);
      context.arc((Constants.MAP_TILE/2)*(1/2.5),-(Constants.MAP_TILE/2)*(1/6),(Constants.MAP_TILE/2)*(1/15),0,2*Math.PI);
    context.closePath();
    context.fillStyle="#000";
    context.fill();
  context.restore();
}


skin.render = (version,me,player,canvas,context,shrek) => {

 
  switch (version) {
    case 0:
      defaultSkin(me,player,canvas,context);
      break;
    case 1:
      pacman(me,player,canvas,context);
      break;
    case 2:
      ghost(me,player,canvas,context);
      break;
    case 3:
    //  shrekDraw(me,player,canvas,context,shrek);
      break;
    default:
      break;
  }
}


export default skin;
