import shaderSources from '../glsl';
import Shader from './shader';
import VertexArray from './vertexbuffer';
export function nextPowOf2(x) {
  return Math.pow(2, Math.ceil(Math.log(x) / Math.log(2)));
}

export function length(vec) {
  switch(vec.length) {
    case 2:
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    case 3:
      return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    default: {
      return Math.sqrt(vec.reduce((a, b) => a * a + b * b));
    }
  }
}

export function normalize(vec) {
  const len = length(vec);
  switch(vec.length) {
    case 2:
      return [
        vec[0] / len,
        vec[1] / len
      ];
    case 3:
      return [
        vec[0] / len,
        vec[1] / len,
        vec[2] / len
      ];
    default: {
      const ret = [];
      for(let i = 0; i < vec.length; i++) {
        ret[i] = ret[i] / len;
      }
      return ret;
    }
  }
}

const uvVertArray = new VertexArray(
  [
    1.0, 1.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 0.0,
    1.0, -1.0, 1.0, 0.0
  ],
  [0, 1, 2, 0, 2, 3],
  [2, 2]);
export function debugDrawTexture(gl, texture) {
  uvVertArray.initialize(gl);

  const textureShader = Shader(shaderSources.texture);
  textureShader.compile(gl);
  gl.clear(gl.COLOR_BUFFER_BIT);

  textureShader.bind(gl);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  textureShader.uniforms.sampler = 0;

  uvVertArray.bind(gl);
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  uvVertArray.unbind(gl);
  textureShader.unbind(gl);
}

