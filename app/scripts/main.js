var context = require('./gl.js');
context(document.querySelector("#canvas"));
var gl = context.gl;
var Shader = require('./shader.js')
var VertexArray = require('./vertexbuffer.js');
var Emitter = require('./emitter.js');
var Renderer = require('./renderer.js');
var emitter = new Emitter(5).spread(45).acceleration(0.0).speed(0.001).pos([0, 0, 0]);
window.emitter = emitter;

Promise.all(["test", "particleShader"].map(Shader.createShader)).then((shaders) => {
  var s = shaders[0];
  var vertexArray = new VertexArray(
    [1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0],
    [0, 1, 2,
     0, 2, 3],
    [2]);

  function draw() {
    emitter.tick();

    gl.clearColor(0, 0, 0, 1);
    gl.disable(gl.CULL_FACE);
    s.use();
    s.uniforms.r = 0.0;
    s.uniforms.g = 0.5;
    s.uniforms.b = 1.0;
    s.uniforms.alpha = 1.0;
    gl.clear(gl.COLOR_BUFFER_BIT);
    vertexArray.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    Renderer.renderParticles(emitter.particles, shaders[1]);
    window.requestAnimationFrame(draw);
  }
  draw();
});
