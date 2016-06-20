import otherFrag from './other.frag';
import otherVert from './other.vert';
import particleShaderFrag from './particleShader.frag';
import particleShaderVert from './particleShader.vert';
import testFrag from './test.frag';
import testVert from './test.vert';

export default {
  other: {
    frag: otherFrag,
    vert: otherVert
  },
  particle: {
    frag: particleShaderFrag,
    vert: particleShaderVert
  },
  test: {
    frag: testFrag,
    vert: testVert
  }
};
