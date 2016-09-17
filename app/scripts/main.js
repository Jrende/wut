import Shader from './shader';
import shaderSources from '../glsl';
import VertexArray from './vertexbuffer';
import ParticleComputeShader from './ParticleComputeShader';
import { debugDrawTexture } from './utils.js';
//import './webgl-debug';

const elm = document.querySelector('#canvas');
const gl = elm.getContext('webgl', {
  preserveDrawingBuffer: true
});

//const size = 32;
const size = 256;
const particleComputeShader = new ParticleComputeShader(size);
particleComputeShader.compile(gl);

const particles = size * size;

const particleRenderShader = new Shader(shaderSources.particleRenderer);
particleRenderShader.compile(gl);
const particleVArray = new VertexArray(particles * 4 * 4, particles * 6, [2, 2]);
for(let i = 0; i < particles; i++) {
  const x = (i % size) / size;
  const y = ~~(i / size) / size;
  particleVArray.pushVertices([
    0.01, 0.01, x, y,
    -0.01, 0.01, x, y,
    -0.01, -0.01, x, y,
    0.01, -0.01, x, y
  ]);
  particleVArray.pushIndex([0, 1, 2, 0, 2, 3].map((num) => num + (i * 4)));
}

const randomShader = Shader(shaderSources.random);
randomShader.compile(gl);

particleVArray.initialize(gl);
gl.clearColor(0, 0, 0, 1);
function draw() {
  particleComputeShader.compute(gl);
  gl.clear(gl.COLOR_BUFFER_BIT);
  particleRenderShader.bind(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, particleComputeShader.getPosition());
  particleRenderShader.uniforms.position = 0;

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, particleComputeShader.getVelocity());
  particleRenderShader.uniforms.velocity = 1;

  particleVArray.bind(gl);

  gl.drawElements(gl.TRIANGLES, particles * 6, gl.UNSIGNED_SHORT, 0);
  particleRenderShader.unbind(gl);
  particleVArray.unbind(gl);

  window.requestAnimationFrame(draw);
}
draw();
