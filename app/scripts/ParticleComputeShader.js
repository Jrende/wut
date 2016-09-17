import shaderSources from '../glsl';
import Shader from './shader';
import VertexArray from './vertexbuffer';
import { nextPowOf2 } from './utils';

function createFramebuffer(gl, size) {
  const framebuffer = gl.createFramebuffer();
  const texture = gl.createTexture();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //Unneccessary, data is never used.
  //This is only to silence warnings, but is probably the wrong way to do it.
  const data = new Uint8Array(4 * size * size);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //gl.generateMipmap(gl.TEXTURE_2D);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { framebuffer, texture, width: size, height: size };
}


export default class ParticleComputeShader {
  constructor(size) {
    this.size = nextPowOf2(size);
    this.vertexArray = new VertexArray(
      [
        1.0, 1.0, 1.0, 1.0,
        -1.0, 1.0, 0.0, 1.0,
        -1.0, -1.0, 0.0, 0.0,
        1.0, -1.0, 1.0, 0.0
      ],
      [0, 1, 2, 0, 2, 3],
      [2, 2]);
  }

  compile(gl) {
    this.vertexArray.initialize(gl);

    this.positionShader = Shader(shaderSources.particlePosition);
    this.positionShader.compile(gl);
    this.velocityShader = Shader(shaderSources.particleVelocity);
    this.velocityShader.compile(gl);

    this.buffers = {
      velocity: [
        createFramebuffer(gl, this.size),
        createFramebuffer(gl, this.size)
      ],
      position: [
        createFramebuffer(gl, this.size),
        createFramebuffer(gl, this.size)
      ]
    };

    const randomShader = Shader(shaderSources.random);
    randomShader.compile(gl);
    const solidShader = Shader(shaderSources.solid);
    solidShader.compile(gl);

    this.initializeFramebuffers(gl,
      this.buffers.velocity[1].framebuffer,
      randomShader,
      [1, 1, 1],
      1.0);
    this.initializeFramebuffers(gl,
      this.buffers.position[1].framebuffer,
      solidShader,
      [0.5, 0.5, 0]);
  }

  initializeFramebuffers(gl, buffer, shader, colors = [1, 1, 1], scale = 1.0, seed = 1.0, alpha = 1.0) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
    gl.clear(gl.COLOR_BUFFER_BIT);

    shader.bind(gl);
    shader.uniforms.seed = seed;
    shader.uniforms.scale = scale;
    shader.uniforms.r = colors[0];
    shader.uniforms.g = colors[1];
    shader.uniforms.b = colors[2];
    shader.uniforms.alpha = alpha;

    this.vertexArray.bind(gl);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.vertexArray.unbind(gl);
    shader.unbind(gl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  compute(gl) {
    this.fireShader(gl, this.velocityShader,
      this.buffers.velocity[0].framebuffer,
      this.buffers.velocity[1].texture,
      this.buffers.position[1].texture);
    this.fireShader(gl, this.positionShader,
      this.buffers.position[0].framebuffer,
      this.buffers.velocity[1].texture,
      this.buffers.position[1].texture);
    this.buffers.position.reverse();
    this.buffers.velocity.reverse();
  }

  getVelocity() {
    return this.buffers.velocity[0].texture;
  }

  getPosition() {
    return this.buffers.position[0].texture;
  }

  fireShader(gl, shader, framebuffer, velocityTexture, positionTexture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    shader.bind(gl);
    this.vertexArray.bind(gl);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Maybe bind textures once per compute?
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, positionTexture);
    shader.uniforms.position = 0;

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, velocityTexture);
    shader.uniforms.velocity = 1;

    shader.uniforms.resolution = [this.size, this.size];

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    this.vertexArray.unbind(gl);
    shader.unbind(gl);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}
