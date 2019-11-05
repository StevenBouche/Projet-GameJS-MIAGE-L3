import MobileElement from './MobileElement'
import KeyBoardManager from '../manager/KeyboardManager'

let kbManager = KeyBoardManager.getInstance();

export default class Player extends MobileElement {

    constructor(x,y,h,l,color){
        super(x,y);
        this.width = l;
        this.height = h;
        this.color = color;
    }

    draw(ctx,dT){
        var state = kbManager.getState();
        this.update(dT,state);
        var position = this.getPosition();
        ctx.fillStyle = this.color;
        ctx.fillRect(position.x, position.y, this.width, this.height);
    }

}