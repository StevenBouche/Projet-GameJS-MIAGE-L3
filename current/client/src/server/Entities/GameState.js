class GameState {

    constructor(){
        this.lastTimeFrame = 0;
        this.bufferInput = []
        this.bufferState = [];
    }

    addInput = (input,idPlayer) => {
        let { t , dir} = input;
        if(t>=0 && dir != undefined) {
            this.bufferInput[t] = {t: t, dir:input.dir, idplayer:idPlayer};
        }
    }

    addState = (gameObject) => {
        let { t } = gameObject;
      //  console.log(Object.keys(this.bufferState).length)
        if(Object.keys(this.bufferState).length > 200) {
            var elem =Object.keys(this.bufferState)[0]
            delete this.bufferState[elem];
        }

        if(t>=0) {
            this.lastTimeFrame = t;
            this.bufferState[t] = gameObject;

         //   console.log(this.lastTimeFrame,t);
        }
      //  console.log(Object.keys(this.bufferState).length)
    }

    getFirstInput = () =>{
    
     //   console.log(this.bufferInput.splice(0,1));
        let data = Object.keys(this.bufferInput)[0];
        if(data == undefined) return data;
        let element = this.bufferInput[data];
        return element;
    }

    getLastUpdateGame = () => {
        return this.bufferState[this.lastTimeFrame];
    }

    haveInputUnprocceded = () => {
       
        let b = false;
        for(let i = 0; i < Object.keys(this.bufferInput).length ; i++){
           //  console.log(Object.keys(this.bufferInput)[i])
            let key = Object.keys(this.bufferInput)[i];
            if(key!=undefined){
                let input = this.bufferInput[key];
              //  console.log(input.t, time)
                if( input.t < this.lastTimeFrame) {
                 //   console.log("input unproce")
                 //   console.log(input, this.lastTimeFrame)
                    return true;
                } 
            }
        }     
        return false;
    }

    update = () => {
     //   console.log("update")
    //    console.log(this.getFirstInput(),this.lastTimeFrame)

        // Pour tous les inputs qui sont inferieur au temps courant on recalcul
        let input = this.getFirstInput();
        if(input == undefined) return;

        while(input.t < this.lastTimeFrame){
            
            //Cherche l'indice d'un etat de jeux dans le buffer correspondant au temps de l'input
            let index = Object.keys(this.bufferState).findIndex((element) => element == input.t);

          //  console.log(index)

            //si il existe pas donc : -1
            if(index < 0){

                //On recupere les etats qui sont inferieur au temps de l'input 
                let filtre= Object.keys(this.bufferState).filter(element => element  < input.t);
                //On recupere l'indice du dernier element du filtre 
                index = filtre.length-1;

                let keyCurrent = Object.keys(this.bufferState)[index];
                //On calcule le delta time entre l'index du dernier element et le temps input
                let dt = (input.t - this.bufferState[keyCurrent].t) / 1000;
                //Clone l'etat du jeu avant l'input
                let newGame = this.bufferState[keyCurrent].clone();
              //  console.log(newGame.dt, newGame.t)
           //     console.log(newGame)

                // on applique l'input au joueur
                newGame.handleInput(input.idplayer,input.dir);
                newGame.dt = dt;
                newGame.t = input.t;
                //on update le prochain etat du jeu
                newGame.update(dt,input.t);
               // console.log(newGame.dt, newGame.t)
                this.addState(newGame);
                index = Object.keys(this.bufferState).findIndex((element) => element == input.t);
              //  console.log(index);
            } else {
                let keyCurrent = Object.keys(this.bufferState)[index];
                this.bufferState[keyCurrent].handleInput(input.idplayer,input.dir);
            }

         //   console.log(index)

            for(let i = index; i < Object.keys(this.bufferState).length-1; i++){
                
                let keyCurrent = Object.keys(this.bufferState)[i];
                let keyNext = Object.keys(this.bufferState)[i+1];
                let dt = (this.bufferState[keyNext].t - this.bufferState[keyCurrent].t) / 1000;
                let clone = this.bufferState[keyCurrent].clone();
                clone.dt = dt;
                clone.t = this.bufferState[keyNext].t;
                clone.update(clone.dt,clone.t);
                this.addState(clone);
            }

            delete this.bufferInput[input.t];
            input = this.getFirstInput();
            if(input == undefined) break;
        }




    /*    for(let input = this.getFirstInput(); input != undefined && input.t < this.lastTimeFrame; input = this.getFirstInput()){
            
        

        }*/

     
    }


}

module.exports = GameState;