import VertexArray from './vertexbuffer.js';
const quad = new VertexArray(
[0.01, 0.01,
-0.01, 0.01,
-0.01, -0.01,
0.01, -0.01],
[0, 1, 2,
0, 2, 3],
[2]);

export function renderParticles(gl, particles, particleShader) {
  if(!quad.isInitialized) {
    quad.initialize(gl);
  }
  particleShader.bind(gl);
  quad.bind(gl);
  for(let i = 0; i <= particles.length; i += 8) {
    const pos = [
      particles[i],
      particles[i + 1]
    ];
    particleShader.uniforms.pos = pos;
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }
}
