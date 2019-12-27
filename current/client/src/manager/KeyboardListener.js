import { INPUT } from '../shared/constants'
import equal from 'deep-equal'

var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40, space: 32,  z:90, s:83, q:81, d:68};

class KeyBoardListener {

    constructor(){
        this.observers = [];
        this.state = {};
        document.addEventListener('keydown',this.keyDownHandler, false);
    }

    resetInput(){
        this.state = {};
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
            let data = {
                t: Date.now(),
                dir: state
            }
            this.observers.forEach(observer => observer.updateInput(data));
        }
    }   

    keyDownHandler = (event) => {

        if(event.keyCode === KeyboardHelper.right || event.keyCode === KeyboardHelper.d) {
           this.notifyInput(INPUT.E);
        }
        else if(event.keyCode === KeyboardHelper.left || event.keyCode === KeyboardHelper.q) {
            this.notifyInput(INPUT.O);
        }
        else if(event.keyCode === KeyboardHelper.down || event.keyCode === KeyboardHelper.s) {
            this.notifyInput(INPUT.S);
        }
        else if(event.keyCode === KeyboardHelper.up || event.keyCode === KeyboardHelper.z) {
            this.notifyInput(INPUT.N);
        }
        else if(event.keyCode === KeyboardHelper.space ) {
            this.notifyInput(INPUT.STOP);
        }
    }
}

export default KeyBoardListener;