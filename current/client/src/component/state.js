
const RENDER_DELAY = 100;
const SIZE_BUFFER = 200;

export default class State {

    constructor(){
        this.stateGame = [];
        this.inputGame = [];
        this.timestampFirstServer = 0;
        this.gameStartTimestamp = 0;
    }

    currentServerTime = () => { return (this.timestampFirstServer + (Date.now() - this.gameStartTimestamp) - RENDER_DELAY)}

    updateStateGame = (update) => {
        if (!this.timestampFirstServer) {
            this.timestampFirstServer = update.t;
            this.gameStartTimestamp = Date.now();
        }

     //   this.stateGame.gameUpdates.push(update);
    }

    updateInput(input){
        console.log(this.currentServerTime());
      //  this.inputGame.push({t: this.currentServerTime, input: input});
    }

    prediction(){
      //  months.splice(0,1);
    }

}