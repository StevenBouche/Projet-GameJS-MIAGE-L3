const Direction = {
    N: 0,
    S: 1,
    E: 2,
    O: 3,
    NE: 4,
    NO: 5,
    SE: 6,
    SO: 7,
    NONE: 8,
    MAX: 8,
    MIN: 0,
    properties: [
        {name: "N", vx: 0, vy: -1}, // canvas en -y x
        {name: "S", vx: 0, vy: 1},
        {name: "E", vx: 1, vy: 0},
        {name: "O", vx: -1, vy: 0},
        {name: "NE", vx: 1, vy: -1},
        {name: "NO", vx: -1, vy: -1},
        {name: "SE", vx: 1, vy: 1},
        {name: "SO", vx: -1, vy: 1},
        {name: "NONE", vx: 0, vy: 0}
    ]
};

Direction.getIndexProps = (index) => {
    return Direction.properties[index]
}

Direction.getDirection = (state) => {
    var upPressed = state.upPressed;
    var downPressed = state.downPressed;
    var rightPressed = state.rightPressed;
    var leftPressed = state.leftPressed;
    if(upPressed && rightPressed) return Direction.NE;
    if(upPressed && leftPressed) return Direction.NO;
    if(downPressed && rightPressed) return Direction.SE;
    if(downPressed && leftPressed) return Direction.SO;
    if(rightPressed) return Direction.E;
    if(leftPressed) return Direction.O;
    if(upPressed) return Direction.N;
    if(downPressed) return Direction.S;
    else return Direction.NONE;
}

export default Direction;