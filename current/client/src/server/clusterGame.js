const express = require('express');
const socketio = require('socket.io');
const { MSG_TYPES } = require('../shared/constants');
const GameManager = require('./Manager/GameManager');

let App = {};

App.setupActionConnexion = (socket) => {
    console.log('Player connected!', socket.id);
    socket.on(MSG_TYPES.JOIN_GAME, (data) => { App.joinGame(socket,data) });
    socket.on(MSG_TYPES.INPUT, (data) => {App.handleInput(socket,data)});
    socket.on('ntpsync', (data) => {App.handleNTP(socket, data)});
    socket.on('disconnect', (data) => {App.onDisconnect(socket)});
}

App.setupEngineGame = () => {
    return new Promise( resolve => {
        App.gameManager = new GameManager();
        resolve();
    }) 
}

App.joinGame = (socket,data) => {
    App.gameManager.addPlayer(socket, data);
}

App.handleInput = (socket,data) => {
    App.gameManager.handleInput(socket,data);
}

App.handleNTP = (socket,data) => {
    data.rt = Date.now();
    data.ot = data.tt;
    data.tt = Date.now();
    socket.emit('ntpsyncclient',data);
}

App.onDisconnect = (socket) => {
    App.gameManager.removePlayer(socket)
}

App.start = async () => {
    App.app = express();
    //App.port = process.env.PORT || 3001;
    App.server = App.app.listen(App.port);
    App.io = socketio(App.server);
    console.log(`Server listening on port ${App.port}`);

    App.setupEngineGame().then(() => {
        console.log(`Engine Game setup`);

        App.io.on('connection', socket => { // Listen for socket.io connections
            App.setupActionConnexion(socket);
        });

        process.on('uncaughtException', function(err){
            //console.log(err);
        //    logger.log('info', err);
            //Send some notification about the error  
            process.exit(1);
        });
    });
}




module.exports = App;

