import './gl.js';
import Shader from './shader.js';
import VertexArray from './vertexbuffer.js'
import Emitter from './emitter.js';
import * as Renderer from './renderer.js';
console.log("Create context");
var emitter = new Emitter(5000).growth(250).spread((i) => {
  return i * 79;
}).acceleration(0.00002).speed(0);
window.emitter = emitter;

Promise.all(['test', 'particleShader'].map(Shader.createShader)).then((shaders) => {
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
    s.uniforms.g = 0.0;
    s.uniforms.b = 0.0;
    s.uniforms.alpha = 1.0;
    gl.clear(gl.COLOR_BUFFER_BIT);
    vertexArray.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    Renderer.renderParticles(emitter.getValues(), shaders[1]);
    window.requestAnimationFrame(draw);
  }
  draw();
});
