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

  if(maxParticles < 100) Cores = 1;
  var part = Math.floor(maxParticles / Cores);
  var rest = maxParticles % Cores;

  self.particles = [];
  self.particles.get = function(particle, attribute, value) {
    var arrayIndex = Math.floor(particle / part);
    var indexInArray = particle % part;
    if(arrayIndex == Cores) {
      arrayIndex -= 1;
      indexInArray += part;
    }
    if(value != null) {
      self.particles[arrayIndex][indexInArray * ParticleSize + attribute] = value;
    }
    return self.particles[arrayIndex][indexInArray * ParticleSize + attribute];
  };

  for(var i = 0; i < Cores; i++) {
    var size = part + (i==Cores - 1? rest : 0);
    self.particles[i] = new Float32Array(size * ParticleSize);
  }

  var createParticle = function() {
    //Sort particles by ttl
    var particle = particleCount;
    self.particles.get(particle, PosX, self.values.pos[0]);
    self.particles.get(particle, PosY, self.values.pos[1]);
    self.particles.get(particle, PosZ, self.values.pos[2]);
    self.particles.get(particle, TimeToLive, self.values.ttl);
    self.getFunction(particle);
    particleCount++;
  }

  var timeSinceLastParticle = 0;
  var particleCount = 0;

  //Default values
  self.values = {
    pos: [0, 0, 0],
    growth: 1,
    spread: () => Math.random() * 360,
    acceleration: () => 1,
    size: 1,
    ttl: 100
  };

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
    //if(timeSinceLastParticle < this.values.growth && particleCount < maxParticles) {
    if(particleCount < maxParticles) {
      console.log("create particle");
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
      var velocity = self.particles.get(particle, Velocity) + self.values.acceleration(particle);
      self.particles.get(particle, Velocity, velocity);

      var posX = self.particles.get(particle, PosX);
      self.particles.get(particle, PosX, posX + velocity);

      var posY = self.particles.get(particle, PosY);
      self.particles.get(particle, PosY, posY + velocity);

      var posZ = self.particles.get(particle, PosZ);
      self.particles.get(particle, PosZ, posZ + velocity);

      var ttl = self.particles.get(particle, TimeToLive);
      self.particles.get(particle, TimeToLive, ttl - 1);
    }
	}
}

module.exports = Emitter;
