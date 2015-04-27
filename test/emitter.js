var assert = require("assert")
var Emitter = require("../app/scripts/emitter.js");
describe('Emitter', function(){
  describe('constructor', function(){
    it('one particle should accelerate in x axis', function(){
			var emitter = new Emitter(1).createParticles(1).spread(0).acceleration(1);
			for(var i = 0; i < 10; i++) {
				emitter.tick();
			}
			emitter.particles[0][0].should.equal(55);
			emitter.particles[0][1].should.equal(0);
			emitter.particles[0][2].should.equal(0);
    })
    it('one particle should accelerate in y axis', function(){
			var emitter = new Emitter(1).createParticles(1).spread(90).acceleration(1);
			for(var i = 0; i < 10; i++) {
				emitter.tick();
			}

			emitter.particles[0][0].should.equal(0);
			emitter.particles[0][1].should.equal(55);
			emitter.particles[0][2].should.equal(0);
    })
  })
})
