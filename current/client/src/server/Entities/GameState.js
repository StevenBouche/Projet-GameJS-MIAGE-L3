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
        if(Object.keys(this.bufferState).length > 200) {
            var elem =Object.keys(this.bufferState)[0];
            delete this.bufferState[elem];
        }
        if(t>=0) {
            this.lastTimeFrame = t;
            this.bufferState[t] = gameObject;
        }
    }

    getFirstInput = () =>{
        let data = Object.keys(this.bufferInput)[0];
        if(data == undefined) return data;
        let element = this.bufferInput[data];
        return element;
    }

    getLastUpdateGame = () => {
        let key = Object.keys(this.bufferState)[Object.keys(this.bufferState).length-1];
        return this.bufferState[key];
    }

    getLastTimeGame = () => {
        let lastGame = this.getLastUpdateGame();
        if(lastGame == undefined) return undefined;
        return lastGame.t;
    }

    haveInputUnprocceded = () => {
        for(let i = 0; i < Object.keys(this.bufferInput).length ; i++){
            let key = Object.keys(this.bufferInput)[i];
            if(key!=undefined){
                let input = this.bufferInput[key];
                if( input.t < this.getLastTimeGame()) return true;
            }
        }     
        return false;
    }

    insertKey=(key,value,obj,pos)=>{
        if(Object.keys(this.bufferState).length > 1000) {
            var elem =Object.keys(this.bufferState)[0];
            delete this.bufferState[elem];
        }
        return Object.keys(obj).reduce((ac,a,i) => {
            if(i === pos) ac[key] = value;
            ac[a] = obj[a]; 
            return ac;
        },{})
    }

    update = () => {
 
        let input = this.getFirstInput();
        
        if(input == undefined) return;

        // Pour tous les inputs qui sont inferieur au temps courant on recalcul
        while(input.t < this.getLastTimeGame()){
            
            //Cherche l'indice d'un etat de jeux dans le buffer correspondant au temps de l'input
            let index = Object.keys(this.bufferState).findIndex((element) => element == input.t);
            
            //si il existe pas donc : -1
            if(index < 0){
                //On recupere les etats qui sont inferieur au temps de l'input 
                let filtre = Object.keys(this.bufferState).filter(element => {return element < input.t});
                //On recupere l'indice du dernier element du filtre 
                index = filtre.length-1;
                let keyCurrent = Object.keys(this.bufferState)[index];

                //On calcule le delta time entre l'index du dernier element et le temps input
                let dt = (input.t - this.bufferState[keyCurrent].t) / 1000;
                //Clone l'etat du jeu avant l'input
                let newGame = this.bufferState[keyCurrent].clone();

                // on applique l'input au joueur
             //   console.log(newGame.timePlayers)
                if(newGame.players[input.idplayer] != undefined) newGame.players[input.idplayer].nextDirection = input.dir;
                //ntp sync
                if(newGame.timePlayers[input.idplayer] != undefined) {
                    newGame.timePlayers[input.idplayer].ot = input.t;
                    newGame.timePlayers[input.idplayer].rt = Date.now();
                }

                newGame.dt = dt;
                newGame.t = input.t;

                //on update le prochain etat du jeu
                newGame.update(dt,input.t);

                this.bufferState = this.insertKey(input.t,newGame,this.bufferState,index+1);
                index++;
            } else {
                let keyCurrent = Object.keys(this.bufferState)[index];
                let pla = this.bufferState[keyCurrent].players[input.idplayer];
                if(pla != undefined ) this.bufferState[keyCurrent].players[input.idplayer].nextDirection = input.dir;
                //ntp sync
                if(this.bufferState[keyCurrent].timePlayers[input.idplayer] != undefined) {
                    this.bufferState[keyCurrent].timePlayers[input.idplayer].ot = input.t;
                    this.bufferState[keyCurrent].timePlayers[input.idplayer].rt = Date.now();
                }
            }

          
            for(let i = index; i < Object.keys(this.bufferState).length-2; i++){
                let keyCurrent = Object.keys(this.bufferState)[i];
                let keyNext = Object.keys(this.bufferState)[i+1];
                let dt = (this.bufferState[keyNext].t - this.bufferState[keyCurrent].t) / 1000;
                let clone = this.bufferState[keyCurrent].clone();
                clone.dt = dt;
                clone.t = this.bufferState[keyNext].t;
                clone.update(clone.dt,clone.t);
                this.bufferState = this.insertKey(input.t,clone,this.bufferState,i+1);
            }

            delete this.bufferInput[input.t];
            input = this.getFirstInput();
            if(input == undefined) break;
        }
    }
}

module.exports = GameState;