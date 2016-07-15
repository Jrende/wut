import otherFrag from './other.frag';
import otherVert from './other.vert';
import particleShaderFrag from './particleShader.frag';
import particleShaderVert from './particleShader.vert';
import solidFrag from './solid.frag';
import solidVert from './solid.vert';
import textureFrag from './textureShader.frag';
import textureVert from './textureShader.vert';

export default {
  other: {
    frag: otherFrag,
    vert: otherVert
  },
  particle: {
    frag: particleShaderFrag,
    vert: particleShaderVert
  },
  solid: {
    frag: solidFrag,
    vert: solidVert
  },
  texture: {
    frag: textureFrag,
    vert: textureVert
  }
};
