const express = require('express');
const socketio = require('socket.io');
const Constants = require('./shared/constants');
const GameManager = require('./Manager/GameManager')


const app = express();

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);
  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  //socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const gameManager = new GameManager();

function joinGame(username) {
  console.log("join game "+username)
  gameManager.addPlayer(this, username);
}
/*
function handleInput(dir) {
  game.handleInput(this, dir);
}
*/
function onDisconnect() {
  gameManager.removePlayer(this);
}
