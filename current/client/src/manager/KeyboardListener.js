import { INPUT } from '../shared/constants'
import equal from 'deep-equal'

var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40, space: 32};

class KeyBoardListener {

    constructor(){
        this.observers = [];
        this.state = {};
        document.addEventListener('keydown',this.keyDownHandler.bind(this), false);
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const removeIndex = this.observers.findIndex(obs => {
          return observer === obs;
        });
        if (removeIndex !== -1) {
            this.observers = this.observers.slice(removeIndex, 1);
        }
    }

    notifyInput(state){
        if(!equal(this.state,state)){
            this.state = state;
            this.observers.forEach(observer => observer.updateInput(state));
        }
    }   

    keyDownHandler(event) {

        if(event.keyCode === KeyboardHelper.right ) {
           this.notifyInput(INPUT.E);
        }
        else if(event.keyCode === KeyboardHelper.left ) {
            this.notifyInput(INPUT.O);
        }
        else if(event.keyCode === KeyboardHelper.down ) {
            this.notifyInput(INPUT.S);
        }
        else if(event.keyCode === KeyboardHelper.up) {
            this.notifyInput(INPUT.N);
        }
        else if(event.keyCode === KeyboardHelper.space) {
            this.notifyInput(INPUT.STOP);
        }
    }
}

export default KeyBoardListener;