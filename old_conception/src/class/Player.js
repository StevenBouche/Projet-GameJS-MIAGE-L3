import MobileElement from './MobileElement'

export default class Player extends MobileElement {

    constructor(x,y,h,l,color){
        super(x,y);
        this.width = l;
        this.height = h;
        this.color = color;
        this.mx = 0;
        this.my = 0;
    }

    getPositionCenter(){
        var pos = this.getPosition();
        return { x: pos.x+(this.width/2), y: pos.y+(this.height/2)}
    }

    draw(ctx,dT,state,w,h){
        this.update(dT,state);
        var position = this.getPosition();
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.translate(w,h);
        ctx.fillRect(position.x-(this.width/2), position.y-(this.height/2), this.width, this.height);
        ctx.restore();
    }

}