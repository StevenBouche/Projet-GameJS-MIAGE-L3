import React, { Component } from 'react';
import GameManager from '../manager/GameManager'
var equal = require('deep-equal');

export default class Game extends Component{

    state = {
        gameManager: undefined
    }

    componentDidMount(){
        this.setState({gameManager: GameManager.getInstance()})   
    }

    componentDidUpdate(){
       
    }

    render(){
        return (
            <div>
                <canvas id="myCanvas"></canvas>
            </div>
        );
    }


}