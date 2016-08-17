import particleVelocityFrag from './particleVelocity.frag';
import particleVelocityVert from './particleVelocity.vert';
import particleRendererFrag from './particleRenderer.frag';
import particleRendererVert from './particleRenderer.vert';
import particlePositionFrag from './particlePosition.frag';
import particlePositionVert from './particlePosition.vert';
import solidFrag from './solid.frag';
import solidVert from './solid.vert';
import textureFrag from './textureShader.frag';
import textureVert from './textureShader.vert';
import randomFrag from './random.frag';
import randomVert from './random.vert';

export default {
  particlePosition: {
    frag: particlePositionFrag,
    vert: particlePositionVert
  },
  particleVelocity: {
    frag: particleVelocityFrag,
    vert: particleVelocityVert
  },
  solid: {
    frag: solidFrag,
    vert: solidVert
  },
  texture: {
    frag: textureFrag,
    vert: textureVert
  },
  particleRenderer: {
    frag: particleRendererFrag,
    vert: particleRendererVert
  },
  random: {
    frag: randomFrag,
    vert: randomVert
  }
};
