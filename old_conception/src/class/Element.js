import Point from './Point';

export default class Element {

    constructor(x,y){
        this.position = new Point(x,y);
    }

    setPosition(x,y){
        this.position.setCoord(x,y);
    }

    getPosition(){
        return {x: this.position.x, y: this.position.y};
    }

}