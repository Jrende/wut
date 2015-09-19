var util = require('./utils.js')
function toFunction(value) {
  return value instanceof Function ? value : function(i) {return value};
}

//particle is an id (long), backed by values in an Float32Array

var attrs = {
  posX: 0,
  posY: 1,
  posZ: 2,
  dirX: 3,
  dirY: 4,
  dirZ: 5,
 speed: 6,
   ttl: 7
}

function Emitter(maxParticles = 500) {

  //Number of attributes
  var particleSize = 8;
  var self = this;

  self.particles = new Float32Array(maxParticles * particleSize);
/**
 * Set a particle value
 * @param {number} particle - Index of particle to be set
 * @param {number} attribute - Attribute index
 * @param {!number} value - The value to set
 */
  self.particles.set = function(particle, attribute, value) {
    self.particles[particleSize * particle + attribute] = value;
  }

  self.particles.get = function(particle, attribute) {
    return self.particles[particleSize * particle + attribute];
  };

  var createParticle = function() {
    //Sort particles by ttl
    var particle = particleCount;
    self.particles.set(particle, attrs.posX, self.values.pos[0]);
    self.particles.set(particle, attrs.posY, self.values.pos[1]);
    self.particles.set(particle, attrs.posZ, self.values.pos[2]);
    self.particles.set(particle, attrs.speed, self.values.speed(particle));

    var spread = self.values.spread() * (Math.PI/180.0);
    var dir = util.normalize([
      Math.sin(spread),
      Math.cos(spread),
      0
    ])

    self.particles.set(particle, attrs.dirX, dir[0]);
    self.particles.set(particle, attrs.dirY, dir[1]);
    self.particles.set(particle, attrs.dirZ, dir[2]);
    self.particles.set(particle, attrs.ttl, self.values.ttl);
    self.getFunction(particle);
    particleCount++;
  }

  this.createParticles = function(amount) {
    for(var i = 0; i < amount; i++) {
      if(particleCount <= maxParticles) {
        break;
      }
      createParticle();
    }
    return this;
  }

  var timeSinceLastParticle = 0;
  var particleCount = 0;

  //Default values
  self.values = {
    pos: [0, 0, 0],
    growth: 500,
    spread: () => Math.random() * 360,
    acceleration: () => 1,
    speed: () => 0,
    size: 1,
    ttl: 100
  };

  self.pos = function(pos) {
    self.values.pos = pos;
    return self;
  }

  self.spread = function(spread) {
    self.values.spread = toFunction(spread);
    return self;
  }

  self.acceleration = function(acceleration) {
    self.values.acceleration = toFunction(acceleration);
    return self;
  }

  self.growth = function(growth) {
    self.values.growth = growth;
    return self;
  }

  self.size = function(size) {
    self.values.size = size;
    return self;
  }

  self.timeToLive = function(ttl){
    self.values.ttl = toFunction(ttl);
    return self;
  }

  self.speed = function(speed){
    self.values.speed = toFunction(speed);
    return self;
  }

  self.tick = function() {
    if((new Date().getTime() - timeSinceLastParticle) > this.values.growth && particleCount < maxParticles) {
      console.log("create");
      createParticle();
      timeSinceLastParticle = new Date().getTime();
    }
    var fun = self.getFunction();
    for(var i = 0; i < particleCount; i++) {
      fun(i);
    }
  }

  self.getFunction = function() {
    return function(particle) {
      var dir = [
        self.particles.get(particle, attrs.dirX),
        self.particles.get(particle, attrs.dirY),
        self.particles.get(particle, attrs.dirZ)
      ];
      var pos = [
        self.particles.get(particle, attrs.posX),
        self.particles.get(particle, attrs.posY),
        self.particles.get(particle, attrs.posZ)
      ];
      var speed = self.particles.get(particle, attrs.speed);

      pos[0] = pos[0] + dir[0] * speed;
      pos[1] = pos[1] + dir[1] * speed;
      pos[2] = pos[2] + dir[2] * speed;

      self.particles.set(particle, attrs.speed, speed + self.values.acceleration(particle));

      self.particles.set(particle, attrs.posX, pos[0]);
      self.particles.set(particle, attrs.posY, pos[1]);
      self.particles.set(particle, attrs.posZ, pos[2]);

      var ttl = self.particles.get(particle, attrs.ttl);
      self.particles.set(particle, attrs.ttl, attrs.ttl - 1);
    }
  }
  }

  module.exports = Emitter;
