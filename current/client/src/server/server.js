const express = require('express');
const socketio = require('socket.io');
const { MSG_TYPES } = require('../shared/constants');
const GameManager = require('./Manager/GameManager');
var cluster = require('cluster');
let winston = require('winston');

//LOGGER
let logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.printf(info => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
      })
  ),
  transports: [new winston.transports.Console(),new winston.transports.File({filename: './log/'+Date.now()+'-app.log'})]
});


//LOAD SERVER
const loadServer = () => {
  const app = express();

  // Listen on port
  const port = process.env.PORT || 3001;
  const server = app.listen(port);
  console.log(`Server listening on port ${port}`);
  
  // Setup socket.io
  const io = socketio(server);
  
  // Listen for socket.io connections
  io.on('connection', socket => {
    console.log('Player connected!', socket.id);
    socket.on(MSG_TYPES.JOIN_GAME, joinGame);
    socket.on(MSG_TYPES.INPUT, handleInput);
    socket.on(MSG_TYPES.PING, pong);
    socket.on('ntpsync', handleNTP);
    socket.on('disconnect', onDisconnect);
  });
  
  // Setup the Game
  const gameManager = new GameManager();
  
  function joinGame(data) {
    console.log("join game "+data.username)
    console.log(data);
    gameManager.addPlayer(this, data);
  }
  
  function handleInput(dir) {
    gameManager.handleInput(this, dir);
  }
  
  function handleNTP(data){
   
      console.log(data)
      data.rt = Date.now();
      data.ot = data.tt;
      data.tt = Date.now();
      console.log(data);
      this.emit('ntpsyncclient',data);
    
  }
  
  function pong(){
    this.emit(MSG_TYPES.PONG)
  }
  
  function onDisconnect() {
    gameManager.removePlayer(this);
  }

  process.on('uncaughtException', function(err){
    //console.log(err);
    logger.log('info', err);
    //Send some notification about the error  
    process.exit(1);
  });
}

//CLUSTER HANDLE PROCESS SERVER AND RESTART
if (cluster.isMaster) {
  cluster.fork();

  cluster.on('exit', function(worker, code, signal) {
    cluster.fork();
  });
}

if (cluster.isWorker) {
  loadServer();
}



