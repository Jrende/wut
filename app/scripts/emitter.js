var util = require('./utils.js');
function toFunction(value) {
  return value instanceof Function ? value : function(i) {return value;};
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
};

function Emitter(maxParticles = 500) {

  //Number of attributes
  var particleSize = 8;
  var _this = this;

  _this.particles = new Float32Array(maxParticles * particleSize);
  /**
   * Set a particle value
   * @param {number} particle - Index of particle to be set
   * @param {number} attribute - Attribute index
   * @param {!number} value - The value to set
   */
  _this.particles.set = function(particle, attribute, value) {
    _this.particles[particleSize * particle + attribute] = value;
  };

  _this.particles.get = function(particle, attribute) {
    return _this.particles[particleSize * particle + attribute];
  };

  var createParticle = function() {
    //Sort particles by ttl
    var particle = particleCount;
    _this.particles.set(particle, attrs.posX, _this.values.pos[0]);
    _this.particles.set(particle, attrs.posY, _this.values.pos[1]);
    _this.particles.set(particle, attrs.posZ, _this.values.pos[2]);
    _this.particles.set(particle, attrs.speed, _this.values.speed(particle));

    var spread = _this.values.spread(particle) * (Math.PI / 180.0);
    var dir = util.normalize([
      Math.sin(spread),
      Math.cos(spread),
      0
    ]);

    _this.particles.set(particle, attrs.dirX, dir[0]);
    _this.particles.set(particle, attrs.dirY, dir[1]);
    _this.particles.set(particle, attrs.dirZ, dir[2]);
    _this.particles.set(particle, attrs.ttl, _this.values.ttl);
    _this.getFunction(particle);
    particleCount++;
  };

  this.createParticles = function(amount) {
    for(var i = 0; i < amount; i++) {
      if(particleCount <= maxParticles) {
        break;
      }
      createParticle();
    }
    return this;
  };

  var timeSinceLastParticle = 0;
  var particleCount = 0;

  //Default values
  _this.values = {
    pos: [0, 0, 0],
    growth: 500,
    spread: () => Math.random() * 360,
    acceleration: () => 1,
    speed: () => 0,
    size: 1,
    ttl: 100
  };

  _this.pos = function(pos) {
    _this.values.pos = pos;
    return _this;
  };

  _this.spread = function(spread) {
    _this.values.spread = toFunction(spread);
    return _this;
  };

  _this.acceleration = function(acceleration) {
    _this.values.acceleration = toFunction(acceleration);
    return _this;
  };

  _this.growth = function(growth) {
    _this.values.growth = growth;
    return _this;
  };

  _this.size = function(size) {
    _this.values.size = size;
    return _this;
  };

  _this.timeToLive = function(ttl) {
    _this.values.ttl = toFunction(ttl);
    return _this;
  };

  _this.speed = function(speed) {
    _this.values.speed = toFunction(speed);
    return _this;
  };

  _this.func = function(func) {
    _this.values.userFunction = toFunction(func);
    return _this;
  };

  _this.tick = function() {
    if((new Date().getTime() - timeSinceLastParticle) > this.values.growth && particleCount < maxParticles) {
      createParticle();
      timeSinceLastParticle = new Date().getTime();
    }
    var fun = _this.getFunction();
    for(var i = 0; i < particleCount; i++) {
      fun(i);
    }
  };

  _this.getFunction = function() {
    return function(particle) {
      var dir = [
        _this.particles.get(particle, attrs.dirX),
        _this.particles.get(particle, attrs.dirY),
        _this.particles.get(particle, attrs.dirZ)
      ];
      var pos = [
        _this.particles.get(particle, attrs.posX),
        _this.particles.get(particle, attrs.posY),
        _this.particles.get(particle, attrs.posZ)
      ];
      var speed = _this.particles.get(particle, attrs.speed);

      pos[0] = pos[0] + dir[0] * speed;
      pos[1] = pos[1] + dir[1] * speed;
      pos[2] = pos[2] + dir[2] * speed;

      _this.particles.set(particle, attrs.speed, speed + _this.values.acceleration(particle));

      _this.particles.set(particle, attrs.posX, pos[0]);
      _this.particles.set(particle, attrs.posY, pos[1]);
      _this.particles.set(particle, attrs.posZ, pos[2]);

      var ttl = _this.particles.get(particle, attrs.ttl);
      _this.particles.set(particle, attrs.ttl, attrs.ttl - 1);

      if(_this.values.userFunction != null) {
        _this.values.userFunction(_this.particles.subarray(particle * particleSize, (particle + 1) * particleSize));
      }
    };
  };
}

module.exports = Emitter;
