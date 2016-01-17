var util = require('./utils.js');
function toFunction(value) {
  return value instanceof Function ? value : function(i) {return value;};
}

//particle is an id (long), backed by values in an Float32Array

const attrs = {
  posX: 0,
  posY: 1,
  posZ: 2,
  dirX: 3,
  dirY: 4,
  dirZ: 5,
  speed: 6,
  ttl: 7
};

const particleSize = 8;

class ParticleArray {
  constructor(maxParticles) {
    this.maxParticles = maxParticles;
    this.particles = new Float32Array(this.maxParticles * particleSize);
  }

  /**
   * Set a particle value
   * @param {number} particle - Index of particle to be set
   * @param {number} attribute - Attribute index
   * @param {!number} value - The value to set
   */
  set(particle, attribute, value) {
    this.particles[particleSize * particle + attribute] = value;
  }

  get(particle, attribute) {
    return this.particles[particleSize * particle + attribute];
  }
}

export default class Emitter {
  constructor(maxParticles = 500) {
    //Number of attributes

    this.timeSinceLastParticle = 0;
    this.particleCount = 0;
    this.maxParticles = maxParticles;
    this.particles = new ParticleArray(maxParticles);
    this.values = {
      pos: [0, 0, 0],
      growth: 500,
      spread: () => Math.random() * 360,
      acceleration: () => 1,
      speed: () => 0,
      size: 1,
      ttl: 100
    };
  }

  createParticle() {
    //Sort particles by ttl
    var particle = this.particleCount;
    this.particles.set(particle, attrs.posX, this.values.pos[0]);
    this.particles.set(particle, attrs.posY, this.values.pos[1]);
    this.particles.set(particle, attrs.posZ, this.values.pos[2]);
    this.particles.set(particle, attrs.speed, this.values.speed(particle));

    var spread = this.values.spread(particle) * (Math.PI / 180.0);
    var dir = util.normalize([
      Math.sin(spread),
      Math.cos(spread),
      0
    ]);

    this.particles.set(particle, attrs.dirX, dir[0]);
    this.particles.set(particle, attrs.dirY, dir[1]);
    this.particles.set(particle, attrs.dirZ, dir[2]);
    this.particles.set(particle, attrs.ttl, this.values.ttl);
    this.particleCount++;
  }

  createParticles(amount) {
    for(var i = 0; i < amount; i++) {
      if(this.particleCount <= maxParticles) {
        break;
      }
      this.createParticle();
    }
    return this;
  }

  //Default values
  pos(pos) {
    this.values.pos = pos;
    return this;
  }

  spread(spread) {
    this.values.spread = toFunction(spread);
    return this;
  }

  acceleration(acceleration) {
    this.values.acceleration = toFunction(acceleration);
    return this;
  }

  growth(growth) {
    this.values.growth = growth;
    return this;
  }

  size(size) {
    this.values.size = size;
    return this;
  }

  timeToLive(ttl) {
    this.values.ttl = toFunction(ttl);
    return this;
  }

  speed(speed) {
    this.values.speed = toFunction(speed);
    return this;
  }

  func(func) {
    this.values.userFunction = toFunction(func);
    return this;
  }

  tick() {
    if((new Date().getTime() - this.timeSinceLastParticle) > this.values.growth && this.particleCount < this.maxParticles) {
      this.createParticle();
      this.timeSinceLastParticle = new Date().getTime();
    }
    var fun = this.getFunction();
    for(var i = 0; i < this.particleCount; i++) {
      fun(i);
    }
  }

  getFunction() {
    return (particle) => {
      var dir = [
        this.particles.get(particle, attrs.dirX),
        this.particles.get(particle, attrs.dirY),
        this.particles.get(particle, attrs.dirZ)
      ];
      var pos = [
        this.particles.get(particle, attrs.posX),
        this.particles.get(particle, attrs.posY),
        this.particles.get(particle, attrs.posZ)
      ];
      var speed = this.particles.get(particle, attrs.speed);

      pos[0] = pos[0] + dir[0] * speed;
      pos[1] = pos[1] + dir[1] * speed;
      pos[2] = pos[2] + dir[2] * speed;

      this.particles.set(particle, attrs.speed, speed + this.values.acceleration(particle));

      this.particles.set(particle, attrs.posX, pos[0]);
      this.particles.set(particle, attrs.posY, pos[1]);
      this.particles.set(particle, attrs.posZ, pos[2]);

      var ttl = this.particles.get(particle, attrs.ttl);
      this.particles.set(particle, attrs.ttl, attrs.ttl - 1);

      if(this.values.userFunction != null) {
        this.values.userFunction(this.particles.subarray(particle * particleSize, (particle + 1) * particleSize));
      }
    };
  }

  getValues() {
    return this.particles.particles;
  }
}
