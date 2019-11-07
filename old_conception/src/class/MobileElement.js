import Direction from './Direction'
import Element from './Element';

export default class ElementMobile extends Element {

    constructor(x,y){
        super(x,y);
        this.speed = 200;
        this.direction = Direction.NONE;
        this.directionProps = Direction.properties[this.direction];
    }

    setDirection(direction){
        if(direction >= Direction.MIN && direction <= Direction.MAX){
            this.direction = direction;
            this.directionProps = Direction.properties[this.direction];
        }
    }
    
    setSpeed(speed){
        this.speed = speed;
    }

    update(deltaTime,state){
        /*  Angle radian
        let xC = vitesse * Math.cos((90-angle) * (Math.PI / 180) );
        let yC = vitesse * Math.sin((90-angle) * (Math.PI / 180));*/
        this.setDirection(Direction.getDirection(state));
        var position = this.getPosition();
        var x = position.x + (this.speed * deltaTime * Direction.properties[this.direction].vx);
        var y = position.y + (this.speed * deltaTime * Direction.properties[this.direction].vy);
        this.setPosition(x,y);
    }

}