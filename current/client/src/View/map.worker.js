// We define the handlers for the various message types
const handlers = {
    run
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
  
  let { canvas } = message;
  let ctx = canvas.getContext('2d');   
  ctx.save();
  ctx.fillStyle ='rgb(64,64,64)';
  ctx.rect(0, 0, 100, 100);
  ctx.fill();
  ctx.stroke();
  ctx.restore();


    console.log("RUN");
  
  // After we done rendering we can tell the main thread we are done.
  self.postMessage({type: 'resolved'});
}

/*
self.addEventListener("message", startCounter);

function startCounter(event) {
    console.log(event.data, self)
    let initial = event.data;
    setInterval(() => this.postMessage(initial++), 1000);
}*/