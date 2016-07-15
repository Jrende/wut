import shaderSources from '../glsl';
import Shader from './shader';
import VertexArray from './vertexbuffer';
import { nextPowOf2 } from './utils';

function createFramebuffer(gl, width, height) {
  const framebuffer = gl.createFramebuffer();
  const renderbuffer = gl.createRenderbuffer();
  const texture = gl.createTexture();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const w = nextPowOf2(width);
  const h = nextPowOf2(height);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  /*
  //We probably won't need a depth buffer
  const renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
 */

  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return { framebuffer, texture, width: w, height: h };
}


export default class ParticleComputeShader {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.frontbuffer = null;
    this.backbuffer = null;
    this.flip = true;
  }

  compile(gl) {
    this.frontbuffer = createFramebuffer(gl, this.width, this.height);
    this.backbuffer = createFramebuffer(gl, this.width, this.height);
    this.shader = new Shader(shaderSources.particle);
    this.shader.compile(gl);
    const initShader = new Shader(shaderSources.solid);
    initShader.compile(gl);
    this.vertexArray = new VertexArray(
      [
        1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 0, 1.0,
        -1.0, -1.0, 0, 0,
        1.0, -1.0, 1.0, 0
      ],
      [0, 1, 2, 0, 2, 3],
      [2, 2]);
    this.vertexArray.initialize(gl);
    this.initializeFramebuffer(gl, this.frontbuffer.framebuffer, initShader);
    this.initializeFramebuffer(gl, this.backbuffer.framebuffer, initShader);
  }

  initializeFramebuffer(gl, framebuffer) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  compute(gl) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frontbuffer.framebuffer);

    this.shader.bind(gl);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.backbuffer.texture);
    this.shader.uniforms.state = 0;

    this.shader.uniforms.time = Math.random();

    this.vertexArray.bind(gl);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    this.shader.unbind(gl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const temp = this.frontbuffer;
    this.frontbuffer = this.backbuffer;
    this.backbuffer = temp;
  }
}
