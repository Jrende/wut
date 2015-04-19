var context = require('./gl.js');
context(document.querySelector("#canvas"));
var gl = context.gl;
var Shader = require('./shader.js')
var VertexArray = require('./vertexbuffer.js');
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
  /*
  s.r = 1.0;
  s.g = 0.0;
  s.b = 1.0;
  s.alpha = 1.0;
  */
  gl.clear(gl.COLOR_BUFFER_BIT);
  vertexArray.bind();
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
});
