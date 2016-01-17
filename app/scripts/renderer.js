var VertexArray = require('./vertexbuffer.js');
var gl = require('./gl.js').gl;
module.exports = (function() {
  var quad = new VertexArray(
      [0.01,  0.01,
      -0.01,  0.01,
      -0.01, -0.01,
      0.01, -0.01],
      [0, 1, 2,
      0, 2, 3],
      [2]);

  return {
    renderParticles: function(particles, particleShader) {
      particleShader.use();
      quad.bind();
      for(var i = 0; i <= particles.length; i += 8) {
        var pos = [
          particles[i],
          particles[i + 1]
        ];
        particleShader.uniforms.pos = pos;
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      }
    }
  };
})();
