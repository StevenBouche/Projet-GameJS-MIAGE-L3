import React, { Component } from 'react';
import Player from '../class/Player';

//Element
let canvas;
let context;
//Parameters
let sizeTuiles      = 24;
let nbTuilesWidth   = 32;
let nbTuilesHeight  = 18;
let width           = 0;
let height = 0;

let lastTime = (new Date()).getTime();
let currentTime = 0;
let deltaTime = 0;

let PlayerOne = new Player(100,100,15,15,'red');

function initQuadrillage(){
    context.beginPath();
    for(let i = 1; i < nbTuilesWidth; i++){
        context.moveTo(i*sizeTuiles,0);
        context.lineTo(i*sizeTuiles,height);
    }
    for(let i = 1; i < nbTuilesHeight; i++){
        context.moveTo(0,i*sizeTuiles);
        context.lineTo(width,i*sizeTuiles);
    }
    context.stroke();
}

function init(){
    canvas = document.querySelector("#myCanvas");
    width = sizeTuiles * nbTuilesWidth;
    height = sizeTuiles * nbTuilesHeight;
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    context = canvas.getContext('2d');

}

function anime() {
    
    currentTime = (new Date()).getTime();
    deltaTime = (currentTime - lastTime) / 1000;
   //console.log(deltaTime);
    context.clearRect(0, 0, width, height);
    initQuadrillage();
    PlayerOne.draw(context,deltaTime);

    lastTime = currentTime;

    //60frames/seconde
    requestAnimationFrame(anime);
}


export default class Game extends Component{

    state = {

    }

    componentDidMount(){
        init();
        initQuadrillage();
        requestAnimationFrame(anime);
    }

    render(){
        return (<canvas id="myCanvas"></canvas>);
    }


}