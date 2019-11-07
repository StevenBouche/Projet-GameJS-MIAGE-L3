import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8082');


// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function(){
    // call the server-side function 'adduser' and send one parameter (value of prompt)
    socket.emit('adduser', 'REACT');
});

// listener, whenever the server emits 'updatechat', this updates the chat body 
socket.on('updatechat', function (username, data) {
   console.log(username, data)
});

// just one player moved
socket.on('updatepos', function (username, newPos) {
    console.log(username, newPos)
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(listOfUsers) {
   console.log(listOfUsers)
});

// update the whole list of players, useful when a player
// connects or disconnects, we must update the whole list
socket.on('updatePlayers', function(listOfplayers) {
    console.log(listOfplayers)
});