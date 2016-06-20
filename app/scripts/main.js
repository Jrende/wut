import './gl.js';
import Shader from './shader.js';
import shaderSources from '../glsl';
import VertexArray from './vertexbuffer.js';
import Emitter from './emitter.js';
import * as Renderer from './renderer.js';

const emitter = new Emitter(5000)
  .growth(250)
  .spread((i) => i * 79)
  .acceleration(0.00002)
  .speed(0);


const gl = document.querySelector('#canvas').getContext('webgl');

const particleShader = new Shader(shaderSources.particle);
particleShader.compile(gl);

const testShader = new Shader(shaderSources.test);
testShader.compile(gl);

const vertexArray = new VertexArray(
  [1.0, 1.0,
  -1.0, 1.0,
  -1.0, -1.0,
  1.0, -1.0],
  [0, 1, 2,
   0, 2, 3],
  [2]);
vertexArray.initialize(gl);

function draw() {
  emitter.tick();

  gl.clearColor(0, 0, 0, 1);
  gl.disable(gl.CULL_FACE);
  testShader.use();
  testShader.uniforms.r = 0.0;
  testShader.uniforms.g = 0.2;
  testShader.uniforms.b = 0.1;
  testShader.uniforms.alpha = 1.0;
  gl.clear(gl.COLOR_BUFFER_BIT);
  vertexArray.bind(gl);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  Renderer.renderParticles(gl, emitter.getValues(), particleShader);
  window.requestAnimationFrame(draw);
}
draw();
