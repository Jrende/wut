var context = require('./gl.js');
context(document.querySelector("#canvas"));
var gl = context.gl;
var Shader = require('./shader.js')
var VertexArray = require('./vertexbuffer.js');
var Emitter = require('./emitter.js');
var emitter = new Emitter(5).spread(360).acceleration(5);
for(var i = 0; i < 10; i++) {
	emitter.tick();
}
window.emitter = emitter;

Promise.all(["test"].map(Shader.createShader)).then((shaders) => {
  gl.clearColor(0, 0, 0, 1);
  gl.disable(gl.CULL_FACE);
  var s = shaders[0];
  var vertexArray = new VertexArray(
    [1.0, 1.0,
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0],
    [0, 1, 2,
     0, 2, 3],
    [2]);
  s.use();
  s.uniforms.r = 0.0;
  s.uniforms.g = 0.5;
  s.uniforms.b = 1.0;
  s.uniforms.alpha = 1.0;
  gl.clear(gl.COLOR_BUFFER_BIT);
  vertexArray.bind();
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
});
