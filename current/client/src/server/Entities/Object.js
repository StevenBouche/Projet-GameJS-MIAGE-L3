class Object { // Objet pour gerer la physique d'un objet qui bouge 
  constructor(id, x, y, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = {vx: 0, vy: 0};
    this.speed = speed;
  }

  update(dt) {
    this.x += dt * this.speed * this.direction.vx;
    this.y -= dt * this.speed * this.direction.vy;
  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirection(dir) {
    this.direction = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Object;
