function toFunction(value) {
  return value instanceof Function ? value : function(i) {return value};
}

//particle is an id (long), backed by values in an Float32Array

var particleSize = 5;
var attrs = [
	"posX",
	"posY",
	"posZ",
	"vX",
	"vY",
	"vZ",
	"accel",
	"ttl"
]

var Cores = 8

function Emitter(maxParticles = 500) {

	var p = {};
	var particleSize = attrs.length;
	(function() {
	var i = 0
	for(let attr of attrs) {
		p[attr] = i++;
	}
	})();
  var self = this;

  if(maxParticles < 100) Cores = 1;
  var part = Math.floor(maxParticles / Cores);
  var rest = maxParticles % Cores;

  self.particles = [];
  self.particles.set = function(particle, attribute, value) {
    var arrayIndex = Math.floor(particle / part);
    var indexInArray = particle % part;
    if(arrayIndex == Cores) {
      arrayIndex -= 1;
      indexInArray += part;
    }
    if(value != null) {
      self.particles[arrayIndex][indexInArray * particleSize + attribute] = value;
    }
	}

  self.particles.get = function(particle, attribute) {
    var arrayIndex = Math.floor(particle / part);
    var indexInArray = particle % part;
    if(arrayIndex == Cores) {
      arrayIndex -= 1;
      indexInArray += part;
    }
    return self.particles[arrayIndex][indexInArray * particleSize + attribute];
  };

  for(var i = 0; i < Cores; i++) {
    var size = part + (i==Cores - 1? rest : 0);
    self.particles[i] = new Float32Array(size * particleSize);
  }

  var createParticle = function() {
    //Sort particles by ttl
    var particle = particleCount;
    self.particles.set(particle, p.posX, self.values.pos[0]);
    self.particles.set(particle, p.posY, self.values.pos[1]);
    self.particles.set(particle, p.posZ, self.values.pos[2]);
    self.particles.set(particle, p.vX, 0);
    self.particles.set(particle, p.vY, 0);
    self.particles.set(particle, p.vZ, 0);
    self.particles.set(particle, p.ttl, self.values.ttl);
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
			var v = [
				self.particles.get(particle, p.vX),
				self.particles.get(particle, p.vY),
				self.particles.get(particle, p.vZ)
			];
			console.log("velocity: " + v.reduce((a,b) => a + ', ' + b), '');
			var acc = self.particles.get(particle, p.acc);

      self.particles.set(particle, p.vX, v[0] + acc);
      self.particles.set(particle, p.vY, v[1] + acc);
      self.particles.set(particle, p.vZ, v[2] + acc);

      var posX = self.particles.get(particle, p.posX);
      self.particles.set(particle, p.posX, posX + v[0]);

      var posY = self.particles.get(particle, p.posY);
      self.particles.set(particle, p.posY, posY + v[1]);

      var posZ = self.particles.get(particle, p.posZ);
      self.particles.set(particle, p.posZ, posZ + v[2]);

      var ttl = self.particles.get(particle, p.ttl);
      self.particles.set(particle, p.ttl, p.ttl - 1);
    }
	}
}

module.exports = Emitter;
