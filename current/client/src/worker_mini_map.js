import Constants from '../shared/constants'
let canvasMiniMap = document.getElementById('mini-map-canvas');
var ctx = canvasMiniMap.getContext('2d');
document.getElementById('mini-map').classList.remove('hidden');


let data = [];

import { exposeWorker } from 'react-hooks-worker';

const onUpdate = function(dataUpdate){
  console.log(update);
  //data = dataUpdate;
}

exposeWorker(onUpdate);


/*
let startInterval = () => {
    console.log('start thread')
    setInterval(drawData)
}
*/

  /*
*/
/*
let drawData = () => {
    console.log("thread upsate data")
    ctx.clearRect(0,0, Constants.MAP_SIZE/Constants.MAP_TILE, Constants.MAP_SIZE/Constants.MAP_TILE)
         // console.log(this.miniMap)
          data.forEach((element) => {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = element.value.color;
            ctx.rect(element.key.x,  element.key.y, 1, 1);
            ctx.fill();
            ctx.restore();
          });
}*/

 
