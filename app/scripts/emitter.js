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
  var self = this;

  var part = Math.floor(maxParticles / Cores);
  var rest = maxParticles % Cores;

  self.particles = function(i, value) {
    var arrayIndex = Math.floor(i / part);
    var indexInArray = i % part;
    if(arrayIndex == Cores) {
      arrayIndex -= 1;
      indexInArray += part;
    }
    if(value != null) {
      self.particles[arrayIndex][indexInArray] = value;
    }
    return self.particles[arrayIndex][indexInArray];
  };

  for(var i = 0; i < Cores; i++) {
    var size = part + (i==Cores - 1? rest : 0);
    self.particles[i] = new Float32Array(size);
  }

  self.particles(0, 1);
  self.particles(499, 1);
  var createParticle = function() {
    //Sort particles by ttl
    var particle = lastParticle * ParticleSize;
    self.particles[particle + PosX] = self.values.pos[0];
    self.particles[particle + PosY] = self.values.pos[1];
    self.particles[particle + PosZ] = self.values.pos[2];
    self.particles[particle + TimeToLive] = self.values.ttl;
    self.getFunction(particle);
  }

  var timeSinceLastParticle = 0;

  self.values = {};

  self.pos = function(x, y, z) {
    self.values.pos = [x,y,z];
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

  self.tick = function() {
    if(timeSinceLastParticle > growth && particleCount < maxParticles) {
      createParticle();
    }
  }

  self.getFunction = function() {
    return function(particle) {
      particles[particle + Velocity] *= self.values.acceleration(particle);
      var velocity = particles[particle + Velocity];

      particles[particle + PosX] += velocity;
      particles[particle + PosY] += velocity;
      particles[particle + PosZ] += velocity;

      particles[particle + TimeToLive] -= 1;
    }
	}
}

module.exports = Emitter;
