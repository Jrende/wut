import './gl';
import Shader from './shader';
import shaderSources from '../glsl';
import VertexArray from './vertexbuffer';
import ParticleComputeShader from './ParticleComputeShader';
//import Texture from './texture';

const elm = document.querySelector('#canvas');
const gl = elm.getContext('webgl');

const textureShader = new Shader(shaderSources.texture);
textureShader.compile(gl);

const particleComputeShader = new ParticleComputeShader(elm.width, elm.height);
particleComputeShader.compile(gl);
//particleComputeShader.compute(gl);

const flatshader = new Shader(shaderSources.solid);
flatshader.compile(gl);

const vertexArray = new VertexArray(
  [
    1.0, 1.0, 1.0, 1.0,
    -1.0, 1.0, 0, 1.0,
    -1.0, -1.0, 0, 0,
    1.0, -1.0, 1.0, 0
  ],
  [0, 1, 2, 0, 2, 3],
  [2, 2]);
vertexArray.initialize(gl);
//const texture = new Texture('dist/image.png');
//texture.compile(gl);

gl.clearColor(1, 1, 1, 1);
function draw() {
  particleComputeShader.compute(gl);

  gl.disable(gl.CULL_FACE);
  gl.clear(gl.COLOR_BUFFER_BIT);

  textureShader.bind(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, particleComputeShader.frontbuffer.texture);
  textureShader.uniforms.sampler = 0;

  vertexArray.bind(gl);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  window.requestAnimationFrame(draw);
}

draw();
