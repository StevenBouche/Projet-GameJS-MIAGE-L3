import Constants from '../shared/constants'

const skin = {};

skin.nbElement = 0;

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
    context.fill();
    context.stroke();
    context.restore();
}

skin.render = (version,me,player,canvas,context) => {

    switch (version) {
        case 0:
          defaultSkin(me,player,canvas,context);
          break;
        default:
         break;
      }
}


export default skin;