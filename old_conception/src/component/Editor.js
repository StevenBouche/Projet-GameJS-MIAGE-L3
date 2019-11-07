import React, { Component } from 'react';

export default class Editor extends Component{

    state = {
        canvas : undefined,
        context : undefined,
        sizeTuiles : 20,
        nbTuilesWidth : 32,
        nbTuilesHeight : 18,
        width : 0,
        height : 0,
        colorBackground : 'blue',
    }

    render(){
        return(
            <div style={{marginTop: '5%'}}>
                <h2>Editeur</h2>
                <canvas style={{marginTop: '2%'}} id="canvasEdit"></canvas>
            </div>
        );
    }

}