const HashMapCase = require("../server/Entities/HashMapCase");
const Constants = require('../shared/constants');

let running = true;
let data = undefined;
let ctx = undefined;

const handlers = {
    run, stop, dataSend, setCanvas
};

self.onmessage = (e) => {
    let message = e.data;
    // We check whether we have a handler for this message type.
    const handler = handlers[message.type];
    if (!handler) throw new Error(`no handler for type: ${message.type}`);
    // If so, we call it.
    handler(message);
};

function run (message) {
  let size = (Constants.MAP_SIZE/Constants.MAP_TILE) * Constants.MINI_MAP_SIZE;
  ctx.clearRect(0,0,size,size);
  if(data != undefined){ 
    
    data.keys.forEach(element => {
    let box = data.get(element.content); // box -> color, type, Constants.TYPE_CASE, x, y 
    if(box.type === Constants.TYPECASE.AREA){
      let couleur = box.color;
      let x = element.content.x * Constants.MINI_MAP_SIZE;
      let y = element.content.y * Constants.MINI_MAP_SIZE;
      
      ctx.save();
      ctx.fillStyle = couleur;
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.rect( 0, 0, Constants.MINI_MAP_SIZE,  Constants.MINI_MAP_SIZE);
      ctx.fill();
      ctx.stroke();
      ctx.restore(); 
    }
  });
  }

  if(running === true) self.postMessage({type: 'getData'});
  else self.postMessage({type: 'resolved'});
  
}

function stop(message) {
  running = false;
}

function dataSend(message) {
  if(message.minimap != undefined) data = Object.create(HashMapCase.prototype, Object.getOwnPropertyDescriptors(message.minimap));
  setTimeout(run, 1000/30);
}

function setCanvas(message) {
  ctx = message.canvas.getContext('2d');
  run(message);
}
