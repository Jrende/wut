function toFunction(value) {
  return value instanceof Function ? value : function(i) {return value};
}

//particle is an id (long), backed by values in an Float32Array

var ParticleSize = 5;
var PosX = 0;
var PosY = 1;
var PosZ = 2;
var Velocity = 3;
var TimeToLive = 4;

var Cores = 8

function Emitter(maxParticles = 500) {
  this.particles = function() {
  }
  (function() {
    var part = Math.floor(maxParticles / cores);
    var rest = maxParticles % cores;
    for(var i = 0; i < cores; i++) {
      var size = part + (i==0? rest : 0);
      this.particles[i] = ArrayBuffer(size*Float32Array.BYTES_PER_ELEMENT);
    }
  })()
  var createParticle = function() {
    //Sort particles by ttl
    var particle = lastParticle * ParticleSize;
    this.particles[particle + PosX] = this.values.pos[0];
    this.particles[particle + PosY] = this.values.pos[1];
    this.particles[particle + PosZ] = this.values.pos[2];
    this.particles[particle + TimeToLive] = this.values.ttl;
    this.getFunction(particle);
  }

  var timeSinceLastParticle = 0;

  this.values = {};

  this.pos = function(x, y, z) {
    this.values.pos = [x,y,z];
  } 

  this.spread = function(spread) {
    this.values.spread = toFunction(spread);
    return this;
  } 

  this.acceleration = function(acceleration) {
    this.values.acceleration = toFunction(acceleration);
    return this;
  } 

  this.growth = function(growth) {
    this.values.growth = growth;
    return this;
  } 
  
  this.size = function(size) {
    this.values.size = size;
    return this;
  }

  this.timeToLive(ttl) {
    this.values.ttl = toFunction(ttl);
    return this;
  }

  this.tick() {
    if(timeSinceLastParticle > growth && particleCount < maxParticles) {
      createParticle();
    }
  }

  this.getFunction() {
    return function(particle) {
      particles[particle + Velocity] *= this.values.acceleration(particle);
      var velocity = particles[particle + Velocity];

      particles[particle + PosX] += velocity;
      particles[particle + PosY] += velocity;
      particles[particle + PosZ] += velocity;

      particles[particle + TimeToLive] -= 1;
    }
}

module.exports = Emitter;
